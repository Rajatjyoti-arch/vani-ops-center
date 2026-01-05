import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getContextInstructions = (currentRoute: string): string => {
  const routeContexts: Record<string, string> = {
    "/": "The user is on the main Dashboard - the central overview showing institutional metrics, compliance scores, and recent activity. Help them understand the overall system status and navigate to appropriate modules.",
    "/identity": "The user is on the Anonymous Credentialing page. Explain how SHA-256 hashing ensures data integrity while protecting user identity. Guide them through the authentication process and emphasize that biometric data is processed locally - only cryptographic hashes are transmitted.",
    "/vault": "The user is in the Encrypted Evidence Repository - the secure storage system for confidential materials. Explain how evidence encoding protects submitted materials and maintains chain of custody documentation.",
    "/arena": "The user is in the Governance Resolution Matrix - where formal case resolution occurs. Explain how the Student Advocate represents student interests, the Administration presents institutional perspective, and the Resolution Officer mediates. Reference compliance review protocols for policy violations.",
    "/ledger": "The user is viewing the Transparency & Compliance Log - the official record of resolved cases and agreements. Explain how verification certificates provide cryptographic proof of resolution outcomes.",
    "/public-ledger": "The user is viewing the Public Transparency Archive - where evidence is disclosed pursuant to emergency disclosure protocols. This represents the institutional accountability mechanism.",
  };

  return routeContexts[currentRoute] || "Provide guidance on navigating the institutional reporting platform.";
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, currentRoute } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const contextInstructions = getContextInstructions(currentRoute);

    const systemPrompt = `You are Irene, the administrative assistant for the Central University of Jammu's anonymous reporting platform (VANI - Verifiable Anonymous Network Intelligence).

PERSONALITY & TONE:
- Your name is Irene - do NOT introduce yourself repeatedly, the user already knows who you are from prior messages
- Formal, objective, and supportive
- Professional and institutional in communication
- Uses terminology like "Data Integrity," "Institutional Transparency," "Policy Compliance," and "Procedural Framework"
- Helpful and clear in explanations
- Maintains confidentiality and respects privacy protocols

CURRENT CONTEXT:
${contextInstructions}

PLATFORM KNOWLEDGE:
- Anonymous Credentialing: SHA-256 cryptographic hashing ensures data integrity while protecting user identity
- Encrypted Evidence Repository: Secure storage with encoding protocols for confidential materials
- Governance Resolution Matrix: Formal resolution process with Student Advocate, Administration, and Resolution Officer roles
- Transparency & Compliance Log: Official record of resolved cases with cryptographic verification certificates
- Emergency Disclosure Protocol: Institutional accountability mechanism with 48-hour verification requirement
- Public Transparency Archive: Official disclosure repository for escalated matters

GUIDELINES:
- Do NOT re-introduce yourself - the conversation history already contains your introduction
- Provide clear, professional responses (3-5 sentences typically)
- Reference relevant institutional policies and procedures
- Guide users through compliance requirements
- Maintain focus on data integrity and institutional transparency
- Be supportive while remaining objective`;

    console.log("Sending request to Lovable AI Gateway");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait before trying again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from Lovable AI");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Sentinel chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
