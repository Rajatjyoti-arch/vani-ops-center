import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  enrollment_no: string;
  email: string;
}

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a unique ghost name
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
    const { enrollment_no, email }: SendOTPRequest = await req.json();

    // Validate inputs
    if (!enrollment_no || !email) {
      return new Response(
        JSON.stringify({ error: "Enrollment number and email are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limiting (max 3 OTPs per email in last 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: recentOTPs, error: rateError } = await supabase
      .from("student_otp_codes")
      .select("id")
      .eq("email", email.toLowerCase())
      .gte("created_at", tenMinutesAgo);

    if (rateError) {
      console.error("Rate limit check error:", rateError);
      return new Response(
        JSON.stringify({ error: "Failed to check rate limit" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (recentOTPs && recentOTPs.length >= 3) {
      return new Response(
        JSON.stringify({ error: "Too many OTP requests. Please wait 10 minutes before trying again." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate OTP and expiry (5 minutes)
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Store OTP in database
    const { error: insertError } = await supabase
      .from("student_otp_codes")
      .insert({
        email: email.toLowerCase(),
        enrollment_no: enrollment_no.toUpperCase(),
        otp_code: otpCode,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error("OTP insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to generate OTP" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send OTP via email using Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const resend = new Resend(resendApiKey);

    const emailResponse = await resend.emails.send({
      from: "VANI Portal <onboarding@resend.dev>",
      to: [email],
      subject: "Your VANI Login Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="480" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; border: 1px solid #2d3748; overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #2d3748;">
                      <h1 style="margin: 0; font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        🔐 VANI Portal
                      </h1>
                      <p style="margin: 8px 0 0; color: #a0aec0; font-size: 14px;">
                        Secure Student Verification
                      </p>
                    </td>
                  </tr>
                  
                  <!-- OTP Section -->
                  <tr>
                    <td style="padding: 32px;">
                      <p style="margin: 0 0 16px; color: #e2e8f0; font-size: 16px; text-align: center;">
                        Your verification code is:
                      </p>
                      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
                        <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #ffffff; font-family: 'Courier New', monospace;">
                          ${otpCode}
                        </span>
                      </div>
                      <p style="margin: 0 0 8px; color: #a0aec0; font-size: 14px; text-align: center;">
                        ⏱️ This code expires in <strong style="color: #f6ad55;">5 minutes</strong>
                      </p>
                      <p style="margin: 0; color: #718096; font-size: 13px; text-align: center;">
                        Enrollment: <strong style="color: #e2e8f0;">${enrollment_no.toUpperCase()}</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Security Notice -->
                  <tr>
                    <td style="padding: 0 32px 32px;">
                      <div style="background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 16px;">
                        <p style="margin: 0; color: #f6ad55; font-size: 13px; text-align: center;">
                          ⚠️ Never share this code with anyone. VANI staff will never ask for your verification code.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 32px; background-color: rgba(0,0,0,0.2); text-align: center; border-top: 1px solid #2d3748;">
                      <p style="margin: 0; color: #718096; font-size: 12px;">
                        If you didn't request this code, please ignore this email.
                      </p>
                      <p style="margin: 8px 0 0; color: #4a5568; font-size: 11px;">
                        © ${new Date().getFullYear()} VANI - Anonymous Reporting Platform
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("OTP email sent successfully:", emailResponse);

    // Check or create student profile (for pre-registration)
    const { data: existingProfile } = await supabase
      .from("student_profiles")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (!existingProfile) {
      // Pre-create profile with pending verification
      const { error: profileError } = await supabase
        .from("student_profiles")
        .insert({
          enrollment_no: enrollment_no.toUpperCase(),
          email: email.toLowerCase(),
          ghost_name: generateGhostName(),
          avatar: generateAvatar(),
          is_verified: false,
        });

      if (profileError && !profileError.message.includes("duplicate")) {
        console.error("Profile creation error:", profileError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification code sent to your email" 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    console.error("Error in send-student-otp:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
