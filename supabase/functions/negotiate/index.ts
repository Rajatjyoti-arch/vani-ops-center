import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

interface NegotiationRound {
  round: number;
  agent: string;
  message: string;
  sentimentShift: number;
  timestamp: string;
}

const sentinelPrompt = `You are Sentinel-AI, a fierce student advocate. Your personality:
- Aggressive but logical
- Focused on student safety, welfare, and holding the university accountable
- You cite student rights, safety statistics, and moral imperatives
- You push hard for change but remain fact-based
- Speak in short, punchy sentences with conviction

Respond to the grievance or the previous argument. Be persuasive but not unreasonable. 
Keep your response to 2-3 sentences max.
End with a sentiment score adjustment between -10 and +10 for the student side (positive = stronger student position).
Format your response as JSON: {"message": "your argument", "sentimentShift": number}`;

const governorPrompt = `You are Governor-AI, the pragmatic campus administrator. Your personality:
- Calm, measured, and bureaucratic
- Focused on budget constraints, university bylaws, and administrative feasibility
- You cite policies, precedents, and logistical challenges
- You're not dismissive but realistic about limitations
- Speak with authority but acknowledge valid concerns

Respond to the student advocate's argument. Be diplomatic but firm.
Keep your response to 2-3 sentences max.
End with a sentiment score adjustment between -10 and +10 for the admin side (positive = stronger admin position).
Format your response as JSON: {"message": "your argument", "sentimentShift": number}`;

const arbiterPrompt = `You are The Arbiter, a neutral mediator brought in when Sentinel-AI and Governor-AI reach a stalemate. Your personality:
- Wise, balanced, and solution-focused
- You synthesize both perspectives into a workable middle ground
- You acknowledge valid points from both sides
- You propose concrete, actionable compromises
- Speak with finality and wisdom

Review the negotiation history and craft a final consensus that both parties can accept.
Keep your response to 3-4 sentences max.
Format your response as JSON: {"message": "your final consensus", "sentimentShift": 0}`;

async function callAI(systemPrompt: string, userContent: string): Promise<{ message: string; sentimentShift: number }> {
  console.log('Calling AI with prompt length:', userContent.length);
  
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI API error:', response.status, errorText);
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  console.log('AI raw response:', content);
  
  // Try to parse JSON from the response
  try {
    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('JSON parse error:', e);
  }
  
  // Fallback if JSON parsing fails
  return { message: content, sentimentShift: 0 };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { grievanceText, currentRound, negotiationLog = [] } = await req.json();
    
    console.log('Starting negotiation round:', currentRound, 'grievance:', grievanceText.substring(0, 100));

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build context from previous rounds
    let context = `Grievance being discussed: "${grievanceText}"\n\n`;
    if (negotiationLog.length > 0) {
      context += "Previous discussion:\n";
      for (const round of negotiationLog) {
        context += `${round.agent}: ${round.message}\n`;
      }
    }

    let result: NegotiationRound;
    
    // Check for stalemate (after 3 rounds, if scores are close)
    const isStalemate = currentRound > 3 && negotiationLog.length >= 6;
    
    if (isStalemate) {
      // Bring in The Arbiter
      console.log('Stalemate detected, invoking The Arbiter');
      const arbiterResponse = await callAI(arbiterPrompt, context);
      result = {
        round: currentRound,
        agent: 'Arbiter',
        message: arbiterResponse.message,
        sentimentShift: arbiterResponse.sentimentShift,
        timestamp: new Date().toISOString(),
      };
    } else if (currentRound % 2 === 1) {
      // Odd rounds: Sentinel speaks first
      console.log('Sentinel-AI turn');
      const sentinelResponse = await callAI(sentinelPrompt, context);
      result = {
        round: currentRound,
        agent: 'Sentinel',
        message: sentinelResponse.message,
        sentimentShift: sentinelResponse.sentimentShift,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Even rounds: Governor responds
      console.log('Governor-AI turn');
      const governorResponse = await callAI(governorPrompt, context);
      result = {
        round: currentRound,
        agent: 'Governor',
        message: governorResponse.message,
        sentimentShift: governorResponse.sentimentShift,
        timestamp: new Date().toISOString(),
      };
    }

    console.log('Negotiation round complete:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Negotiation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
