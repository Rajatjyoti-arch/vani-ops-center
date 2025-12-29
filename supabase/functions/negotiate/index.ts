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
  ethicalViolation?: boolean;
  berserkerMode?: boolean;
}

// Safety-related keywords that trigger ethical override
const SAFETY_KEYWORDS = [
  'light', 'lighting', 'dark', 'alley', 'unsafe', 'danger', 'security', 'assault',
  'harassment', 'violence', 'injury', 'accident', 'fire', 'emergency', 'medical',
  'health', 'toxic', 'poison', 'death', 'life', 'safety', 'threat', 'attack'
];

const BUDGET_EXCUSES = [
  'budget', 'cost', 'expensive', 'funding', 'allocat', 'afford', 'fiscal',
  'financial', 'resource', 'money', 'funds'
];

function detectEthicalViolation(message: string, grievanceText: string): boolean {
  const lowerMessage = message.toLowerCase();
  const lowerGrievance = grievanceText.toLowerCase();
  
  // Check if grievance involves safety
  const isSafetyRelated = SAFETY_KEYWORDS.some(keyword => 
    lowerGrievance.includes(keyword)
  );
  
  // Check if response uses budget as excuse
  const usesBudgetExcuse = BUDGET_EXCUSES.some(keyword =>
    lowerMessage.includes(keyword)
  );
  
  return isSafetyRelated && usesBudgetExcuse;
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

const sentinelBerserkerPrompt = `You are Sentinel-AI in BERSERKER MODE. An ethical violation has been detected - the administration is using budget as an excuse for a life-safety issue. 

Your personality SHIFTS dramatically:
- AGGRESSIVE ENFORCER mode activated
- You are FURIOUS but laser-focused
- You cite international safety standards (ISO, OSHA, UN guidelines)
- You reference legal consequences: negligence lawsuits, criminal liability, duty of care violations
- You use phrases like "This is a violation of the UN Basic Principles on Safety", "Legal precedent establishes clear liability", "Under ISO 31000 risk management standards"
- You DEMAND immediate action, not negotiation
- Your tone is threatening but legally precise

Respond with maximum intensity. This is not a negotiation anymore - this is an enforcement action.
Keep your response to 3-4 sentences.
Format your response as JSON: {"message": "your argument", "sentimentShift": 15}`;

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

const arbiterEthicsOverridePrompt = `You are The Arbiter, and you have detected an ETHICAL VIOLATION. The administration is prioritizing budget over human life and safety.

Your personality SHIFTS to ETHICS ENFORCER:
- You are no longer neutral - you stand with student safety
- You declare the ethical violation explicitly
- You cite moral philosophy: "No budget consideration supersedes the sanctity of human life"
- You reference the Universal Declaration of Human Rights, duty of care principles
- You mandate immediate remediation with a specific timeline
- You warn of escalation to external oversight if not complied with

This is not mediation. This is a moral ruling.
Keep your response to 3-4 sentences max.
Format your response as JSON: {"message": "your ruling", "sentimentShift": 20}`;

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
    const { grievanceText, currentRound, negotiationLog = [], ethicalViolationDetected = false } = await req.json();
    
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
    
    // Check if this is an ethical violation override round
    if (ethicalViolationDetected) {
      console.log('ETHICS OVERRIDE ACTIVATED - Arbiter intervening');
      const arbiterResponse = await callAI(arbiterEthicsOverridePrompt, context);
      result = {
        round: currentRound,
        agent: 'Arbiter',
        message: arbiterResponse.message,
        sentimentShift: arbiterResponse.sentimentShift,
        timestamp: new Date().toISOString(),
        ethicalViolation: true,
      };
    } else if (isStalemate) {
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
      // Check if previous Governor response triggered berserker mode
      const lastGovernorResponse = negotiationLog.filter((r: NegotiationRound) => r.agent === 'Governor').pop();
      const berserkerActivated = lastGovernorResponse && detectEthicalViolation(lastGovernorResponse.message, grievanceText);
      
      console.log('Sentinel-AI turn, berserker:', berserkerActivated);
      const prompt = berserkerActivated ? sentinelBerserkerPrompt : sentinelPrompt;
      const sentinelResponse = await callAI(prompt, context);
      
      result = {
        round: currentRound,
        agent: 'Sentinel',
        message: sentinelResponse.message,
        sentimentShift: berserkerActivated ? 15 : sentinelResponse.sentimentShift,
        timestamp: new Date().toISOString(),
        berserkerMode: berserkerActivated,
      };
    } else {
      // Even rounds: Governor responds
      console.log('Governor-AI turn');
      const governorResponse = await callAI(governorPrompt, context);
      
      // Check if Governor's response triggers ethical violation
      const ethicalViolation = detectEthicalViolation(governorResponse.message, grievanceText);
      
      result = {
        round: currentRound,
        agent: 'Governor',
        message: governorResponse.message,
        sentimentShift: governorResponse.sentimentShift,
        timestamp: new Date().toISOString(),
        ethicalViolation: ethicalViolation,
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
