import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { secret } = await req.json();
    
    const setupSecret = Deno.env.get("ADMIN_SETUP_SECRET");
    
    if (!setupSecret) {
      console.error("ADMIN_SETUP_SECRET not configured");
      return new Response(
        JSON.stringify({ valid: false, error: "Setup secret not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const isValid = secret === setupSecret;
    
    console.log(`Setup secret verification: ${isValid ? "SUCCESS" : "FAILED"}`);

    return new Response(
      JSON.stringify({ valid: isValid }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-setup-secret:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
