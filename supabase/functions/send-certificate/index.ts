import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendCertificateRequest {
  negotiation_id: string;
  recipient_email: string;
  certificate_data: {
    case_id: string;
    grievance_summary: string;
    final_consensus: string;
    budget_level: string;
    urgency_level: string;
    priority: string;
    admin_notes: string;
    evidence_hash: string;
    approved_at: string;
    verification_url: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { negotiation_id, recipient_email, certificate_data }: SendCertificateRequest = await req.json();

    console.log(`Sending certificate for negotiation ${negotiation_id} to ${recipient_email}`);

    // Generate HTML email content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Official Resolution Certificate</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 40px; color: white;">🛡️</span>
      </div>
      <h1 style="color: #f1f5f9; font-size: 24px; margin: 0 0 8px;">Official Resolution Certificate</h1>
      <p style="color: #64748b; font-size: 14px; margin: 0;">Central University of Jammu • Administrative Oversight Division</p>
    </div>

    <!-- Certificate Card -->
    <div style="background: linear-gradient(180deg, #1e293b, #0f172a); border: 1px solid #334155; border-radius: 16px; padding: 30px; margin-bottom: 20px;">
      
      <!-- Certificate ID -->
      <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #334155;">
        <p style="color: #10b981; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Certificate ID</p>
        <p style="color: #f1f5f9; font-size: 20px; font-weight: bold; margin: 0; font-family: monospace;">CUJ-RES-${certificate_data.case_id}</p>
        <p style="color: #64748b; font-size: 12px; margin: 10px 0 0;">Issued: ${certificate_data.approved_at}</p>
      </div>

      <!-- Status Badge -->
      <div style="text-align: center; margin-bottom: 25px;">
        <span style="display: inline-block; background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border: 1px solid rgba(16, 185, 129, 0.3);">
          ✓ Officially Sealed & Certified
        </span>
      </div>

      <!-- Grievance Summary -->
      <div style="margin-bottom: 25px;">
        <h3 style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px;">Grievance Summary</h3>
        <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6; margin: 0; background: #0f172a; padding: 15px; border-radius: 8px; border-left: 3px solid #10b981;">
          ${certificate_data.grievance_summary}
        </p>
      </div>

      <!-- Final Consensus -->
      <div style="margin-bottom: 25px;">
        <h3 style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px;">Final Consensus</h3>
        <p style="color: #10b981; font-size: 14px; line-height: 1.6; margin: 0; background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
          ${certificate_data.final_consensus}
        </p>
      </div>

      <!-- Administrative Parameters -->
      <div style="margin-bottom: 25px;">
        <h3 style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px;">Administrative Parameters</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; text-align: center;">
            <p style="color: #64748b; font-size: 10px; margin: 0 0 5px;">Budget</p>
            <p style="color: #f1f5f9; font-size: 14px; font-weight: 600; margin: 0; text-transform: uppercase;">${certificate_data.budget_level}</p>
          </div>
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; text-align: center;">
            <p style="color: #64748b; font-size: 10px; margin: 0 0 5px;">Urgency</p>
            <p style="color: #f1f5f9; font-size: 14px; font-weight: 600; margin: 0; text-transform: uppercase;">${certificate_data.urgency_level}</p>
          </div>
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; text-align: center;">
            <p style="color: #64748b; font-size: 10px; margin: 0 0 5px;">Priority</p>
            <p style="color: #f1f5f9; font-size: 14px; font-weight: 600; margin: 0; text-transform: uppercase;">${certificate_data.priority}</p>
          </div>
        </div>
      </div>

      ${certificate_data.admin_notes ? `
      <!-- Admin Notes -->
      <div style="margin-bottom: 25px;">
        <h3 style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px;">Administrative Notes</h3>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0; font-style: italic;">
          "${certificate_data.admin_notes}"
        </p>
      </div>
      ` : ''}

      <!-- Evidence Verification -->
      <div style="background: #0f172a; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
        <h3 style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px;">Evidence Verification</h3>
        <p style="color: #64748b; font-size: 12px; margin: 0; font-family: monospace; word-break: break-all;">
          ${certificate_data.evidence_hash}
        </p>
      </div>

      <!-- Official Seal -->
      <div style="text-align: center; padding: 20px; border-top: 1px solid #334155;">
        <div style="width: 80px; height: 80px; margin: 0 auto 15px; border: 3px solid #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(16, 185, 129, 0.1);">
          <span style="color: #10b981; font-size: 14px; font-weight: bold;">★ CUJ ★</span>
        </div>
        <p style="color: #64748b; font-size: 11px; margin: 0;">
          Verification: <a href="${certificate_data.verification_url}" style="color: #10b981;">${certificate_data.verification_url}</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 20px;">
      <p style="color: #475569; font-size: 12px; line-height: 1.6; margin: 0 0 15px;">
        This certificate confirms that the above resolution has been reviewed, deliberated upon through the Governance Resolution Matrix, and officially approved by the institutional administration.
      </p>
      <p style="color: #334155; font-size: 11px; margin: 0;">
        VANI (Verifiable Anonymous Network Intelligence) • Central University of Jammu
      </p>
    </div>

  </div>
</body>
</html>
    `;

    // Send email via Resend API directly
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "VANI System <onboarding@resend.dev>",
        to: [recipient_email],
        subject: `Official Resolution Certificate - Case ${certificate_data.case_id}`,
        html: htmlContent,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(emailData.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailData);

    // Update admin_notifications to mark email as sent
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: updateError } = await supabase
      .from("admin_notifications")
      .update({
        email_sent: true,
        email_sent_at: new Date().toISOString(),
      })
      .eq("negotiation_id", negotiation_id)
      .eq("notification_type", "resolution_approved");

    if (updateError) {
      console.error("Error updating notification:", updateError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      email_id: emailData?.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-certificate function:", error);
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
