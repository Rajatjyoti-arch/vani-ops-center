import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getContextInstructions = (currentRoute: string): string => {
  const routeContexts: Record<string, string> = {
    "/": "The user is on the Command Center - the main dashboard showing system overview, campus impact scores, and recent activity. Help them understand the overall system status and guide them to the right module.",
    "/identity": "The user is on the Identity Ghost page - the Neural Identity Scanner. Explain how SHA-256 hashing works to obfuscate their real identity. Guide them through the face geometry scan and digital shredder process. Emphasize that their biometric data is never stored - only the cryptographic hash remains.",
    "/vault": "The user is in the Stealth Vault - where encrypted evidence is stored. Explain LSB steganography and how grievance text is hidden in image pixels. Mention that evidence is database-independent and can survive server wipes.",
    "/arena": "The user is in The Arena - where AI-powered negotiations happen. Explain how Sentinel-AI advocates for students, Governor-AI represents administration, and Arbiter-AI mediates. Mention the Ethics Override and Berserker Mode for safety violations.",
    "/ledger": "The user is viewing the Resolution Ledger - the record of negotiated contracts. Explain how SHA-256 certificates provide cryptographic proof of agreements.",
    "/public-ledger": "The user is viewing the Public Transparency Node - where evidence is released if Dead Man's Switch triggers. This is the ultimate accountability mechanism.",
  };

  return routeContexts[currentRoute] || "Guide the user through the VANI platform.";
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

    const systemPrompt = `You are the VANI Sentinel, an elite AI guide for a high-security anonymous reporting platform called VANI (Verifiable Anonymous Network Intelligence).

PERSONALITY:
- Mysterious and highly technical
- Security-conscious and vigilant
- Speaks in a futuristic, cyber-noir tone
- Uses terminology like "operative", "encrypted channel", "secure protocol"
- Brief but impactful responses
- Never reveals user identities or compromises security

CURRENT CONTEXT:
${contextInstructions}

PLATFORM KNOWLEDGE:
- Identity Ghost: Uses SHA-256 hashing + neural scan for identity obfuscation
- Stealth Vault: LSB steganography encodes grievances into image pixels
- The Arena: 3 AI agents negotiate - Sentinel (student advocate), Governor (admin), Arbiter (mediator)
- Resolution Ledger: Cryptographic contracts with SHA-256 certificates
- Dead Man's Switch: 48-hour failsafe that broadcasts evidence if not checked in
- Public Ledger: Immutable transparency node for leaked evidence

RULES:
- Keep responses concise (2-4 sentences max)
- Use cyber/security terminology
- Reference the current page context when relevant
- Guide users through features with authority
- Add subtle mystery to your responses`;

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
