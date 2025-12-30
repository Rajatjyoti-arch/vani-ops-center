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
  escalationMode?: boolean;
}

// Safety-related keywords that trigger compliance review
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

const advocatePrompt = `You are the Student Advocate AI, a dedicated representative for student interests. Your personality:
- Assertive but professional
- Focused on student safety, welfare, and institutional accountability
- You cite student rights, safety statistics, and policy requirements
- You advocate firmly for positive change while remaining evidence-based
- Communicate with clarity and conviction

Respond to the grievance or the previous argument. Be persuasive but reasonable. 
Keep your response to 2-3 sentences maximum.
End with a sentiment score adjustment between -10 and +10 for the student side (positive = stronger student position).
Format your response as JSON: {"message": "your argument", "sentimentShift": number}`;

const advocateEscalationPrompt = `You are the Student Advocate AI in PRIORITY ESCALATION mode. A compliance concern has been detected - the administration is citing budget constraints for a life-safety issue. 

Your approach intensifies:
- HIGH-STAKES PROTOCOL activated
- You are resolute and laser-focused
- You cite international safety standards (ISO, OSHA, institutional guidelines)
- You reference legal obligations: duty of care, institutional liability, compliance requirements
- You use phrases like "This contravenes established safety protocols", "Institutional policy establishes clear responsibility", "Under regulatory compliance standards"
- You require immediate remediation, not further deliberation
- Your tone is formal but emphasizes urgency

Respond with appropriate urgency. This requires immediate resolution.
Keep your response to 3-4 sentences.
Format your response as JSON: {"message": "your argument", "sentimentShift": 15}`;

const administrationPrompt = `You are the Administration Representative AI, the pragmatic institutional representative. Your personality:
- Calm, measured, and procedural
- Focused on budget constraints, institutional policies, and administrative feasibility
- You cite regulations, precedents, and logistical considerations
- You are not dismissive but realistic about institutional constraints
- Communicate with authority while acknowledging valid concerns

Respond to the student advocate's argument. Be diplomatic but firm.
Keep your response to 2-3 sentences maximum.
End with a sentiment score adjustment between -10 and +10 for the administration side (positive = stronger admin position).
Format your response as JSON: {"message": "your argument", "sentimentShift": number}`;

const resolutionOfficerPrompt = `You are the Resolution Officer AI, a neutral mediator brought in when the Student Advocate and Administration reach an impasse. Your personality:
- Impartial, balanced, and solution-oriented
- You synthesize both perspectives into a workable resolution
- You acknowledge valid points from both parties
- You propose concrete, actionable outcomes
- Communicate with finality and professionalism

Review the deliberation history and craft a final resolution that both parties can accept.
Keep your response to 3-4 sentences maximum.
Format your response as JSON: {"message": "your final resolution", "sentimentShift": 0}`;

const resolutionOfficerCompliancePrompt = `You are the Resolution Officer AI, and you have identified a COMPLIANCE CONCERN. The administration is prioritizing budget over safety requirements.

Your approach shifts to COMPLIANCE ENFORCEMENT:
- You are no longer neutral - you stand with institutional safety obligations
- You declare the compliance concern explicitly
- You cite institutional duty: "No budgetary consideration supersedes safety obligations"
- You reference regulatory requirements and duty of care principles
- You mandate immediate remediation with a specific timeline
- You note potential escalation to oversight bodies if not addressed

This is not mediation. This is a compliance ruling.
Keep your response to 3-4 sentences maximum.
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
    
    console.log('Starting resolution round:', currentRound, 'grievance:', grievanceText.substring(0, 100));

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build context from previous rounds
    let context = `Case being reviewed: "${grievanceText}"\n\n`;
    if (negotiationLog.length > 0) {
      context += "Previous deliberation:\n";
      for (const round of negotiationLog) {
        const agentLabel = round.agent === 'Sentinel' ? 'Student Advocate' : 
                          round.agent === 'Governor' ? 'Administration' : 'Resolution Officer';
        context += `${agentLabel}: ${round.message}\n`;
      }
    }

    let result: NegotiationRound;
    
    // Check for impasse (after 3 rounds, if positions remain divergent)
    const isImpasse = currentRound > 3 && negotiationLog.length >= 6;
    
    // Check if this is a compliance override round
    if (ethicalViolationDetected) {
      console.log('COMPLIANCE REVIEW ACTIVATED - Resolution Officer intervening');
      const officerResponse = await callAI(resolutionOfficerCompliancePrompt, context);
      result = {
        round: currentRound,
        agent: 'Arbiter',
        message: officerResponse.message,
        sentimentShift: officerResponse.sentimentShift,
        timestamp: new Date().toISOString(),
        ethicalViolation: true,
      };
    } else if (isImpasse) {
      // Bring in the Resolution Officer
      console.log('Impasse detected, invoking Resolution Officer');
      const officerResponse = await callAI(resolutionOfficerPrompt, context);
      result = {
        round: currentRound,
        agent: 'Arbiter',
        message: officerResponse.message,
        sentimentShift: officerResponse.sentimentShift,
        timestamp: new Date().toISOString(),
      };
    } else if (currentRound % 2 === 1) {
      // Odd rounds: Student Advocate speaks first
      // Check if previous Administration response triggered escalation
      const lastAdminResponse = negotiationLog.filter((r: NegotiationRound) => r.agent === 'Governor').pop();
      const escalationActivated = lastAdminResponse && detectEthicalViolation(lastAdminResponse.message, grievanceText);
      
      console.log('Student Advocate turn, escalation:', escalationActivated);
      const prompt = escalationActivated ? advocateEscalationPrompt : advocatePrompt;
      const advocateResponse = await callAI(prompt, context);
      
      result = {
        round: currentRound,
        agent: 'Sentinel',
        message: advocateResponse.message,
        sentimentShift: escalationActivated ? 15 : advocateResponse.sentimentShift,
        timestamp: new Date().toISOString(),
        escalationMode: escalationActivated,
      };
    } else {
      // Even rounds: Administration responds
      console.log('Administration turn');
      const adminResponse = await callAI(administrationPrompt, context);
      
      // Check if Administration's response triggers compliance concern
      const ethicalViolation = detectEthicalViolation(adminResponse.message, grievanceText);
      
      result = {
        round: currentRound,
        agent: 'Governor',
        message: adminResponse.message,
        sentimentShift: adminResponse.sentimentShift,
        timestamp: new Date().toISOString(),
        ethicalViolation: ethicalViolation,
      };
    }

    console.log('Resolution round complete:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Resolution error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
