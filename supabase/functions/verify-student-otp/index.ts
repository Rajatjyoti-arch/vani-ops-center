import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyOTPRequest {
  enrollment_no: string;
  email: string;
  otp_code: string;
}

// Generate a unique ghost name if needed
function generateGhostName(): string {
  const adjectives = ["Silent", "Shadow", "Phantom", "Mystic", "Crypto", "Stealth", "Hidden", "Veiled", "Masked", "Ghost"];
  const nouns = ["Witness", "Voice", "Observer", "Guardian", "Sentinel", "Watcher", "Speaker", "Advocate", "Reporter", "Agent"];
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${randomNum}`;
}

// Generate a random avatar emoji
function generateAvatar(): string {
  const avatars = ["👻", "🎭", "🦊", "🐺", "🦉", "🐲", "🦅", "🐈‍⬛", "🕵️", "🥷"];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { enrollment_no, email, otp_code }: VerifyOTPRequest = await req.json();

    // Validate inputs
    if (!enrollment_no || !email || !otp_code) {
      return new Response(
        JSON.stringify({ error: "Enrollment number, email, and OTP code are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp_code)) {
      return new Response(
        JSON.stringify({ error: "Invalid OTP format. Must be 6 digits." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find valid OTP
    const { data: otpRecord, error: otpError } = await supabase
      .from("student_otp_codes")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("enrollment_no", enrollment_no.toUpperCase())
      .eq("otp_code", otp_code)
      .eq("is_used", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError) {
      console.error("OTP lookup error:", otpError);
      return new Response(
        JSON.stringify({ error: "Failed to verify OTP" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!otpRecord) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired verification code" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Mark OTP as used
    const { error: updateError } = await supabase
      .from("student_otp_codes")
      .update({ is_used: true })
      .eq("id", otpRecord.id);

    if (updateError) {
      console.error("OTP update error:", updateError);
    }

    // Get or create student profile
    let { data: profile, error: profileError } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (profileError) {
      console.error("Profile lookup error:", profileError);
      return new Response(
        JSON.stringify({ error: "Failed to retrieve profile" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // If no profile exists, create one
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from("student_profiles")
        .insert({
          enrollment_no: enrollment_no.toUpperCase(),
          email: email.toLowerCase(),
          ghost_name: generateGhostName(),
          avatar: generateAvatar(),
          is_verified: true,
        })
        .select()
        .single();

      if (createError) {
        console.error("Profile creation error:", createError);
        return new Response(
          JSON.stringify({ error: "Failed to create profile" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      profile = newProfile;
    } else {
      // Update profile to verified if not already
      if (!profile.is_verified) {
        const { error: verifyError } = await supabase
          .from("student_profiles")
          .update({ is_verified: true })
          .eq("id", profile.id);

        if (verifyError) {
          console.error("Profile verification update error:", verifyError);
        }

        profile.is_verified = true;
      }
    }

    console.log("Student verified successfully:", profile.ghost_name);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification successful",
        profile: {
          id: profile.id,
          enrollment_no: profile.enrollment_no,
          email: profile.email,
          ghost_name: profile.ghost_name,
          avatar: profile.avatar,
          reputation: profile.reputation,
          reports_submitted: profile.reports_submitted,
          created_at: profile.created_at,
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    console.error("Error in verify-student-otp:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
