// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface ReqPayload {
  name: string;
  email: string;
  verificationLink: string;
  referrer?: string;
}

interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

console.info("📬 Email verification function started");

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Validate request method
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Method not allowed. Use POST." 
        }),
        { 
          status: 405, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    // Parse and validate request payload
    let payload: ReqPayload;
    try {
      payload = await req.json();
    } catch (parseError) {
      console.error("❌ Invalid JSON payload:", parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid JSON payload" 
        }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    const { name, email, verificationLink, referrer } = payload;

    // Validate required fields
    if (!name || !email || !verificationLink) {
      console.error("❌ Missing required fields:", { name: !!name, email: !!email, verificationLink: !!verificationLink });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields: name, email, and verificationLink are required" 
        }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid email format" 
        }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    // Get environment variables
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const sender = Deno.env.get("RESEND_SENDER") || "MinimalMind <onboarding@minimalmind.com>";
    
    if (!resendKey) {
      console.error("❌ Missing RESEND_API_KEY in environment");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email service configuration error" 
        }),
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    // Create email HTML template
    const referrerText = referrer ? `You were invited by <strong>${referrer}</strong> to join` : "Welcome to";
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to MinimalMind</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6B3FFF 0%, #BBA7FF 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Welcome to MinimalMind</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your privacy-first reading companion</p>
          </div>
          
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <h2 style="color: #1A1438; margin: 0 0 20px 0; font-size: 22px;">Hi ${name}! 👋</h2>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #4A5568;">
              ${referrerText} <strong>MinimalMind</strong> — your new personal space to track books, build reading habits, and grow with clarity.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="background: #6B3FFF; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; transition: background 0.3s ease;">
                Verify Your Account
              </a>
            </div>
            
            <p style="margin: 20px 0 0 0; font-size: 16px; color: #4A5568;">
              We're thrilled to have you onboard. Let the journey begin! 🌱📚
            </p>
            
            <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #718096; margin: 0;">
              If you didn't request this account, you can safely ignore this email. The verification link will expire in 24 hours.
            </p>
            
            <p style="font-size: 12px; color: #A0AEC0; margin: 20px 0 0 0; text-align: center;">
              © 2025 MinimalMind. Made with ❤️ for readers everywhere.
            </p>
          </div>
        </body>
      </html>
    `;

    // Send email via Resend API
    console.info(`📧 Sending verification email to ${email}`);
    
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [email],
        subject: `Welcome to MinimalMind, ${name}! 🌟`,
        html: html,
      }),
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      console.error("❌ Resend API error:", {
        status: resendRes.status,
        statusText: resendRes.statusText,
        body: errorText
      });
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to send verification email",
          details: `Resend API returned ${resendRes.status}: ${resendRes.statusText}`
        }),
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    const resendData = await resendRes.json();
    console.info("✅ Email sent successfully:", { id: resendData.id, to: email });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Verification email sent to ${email}`,
        emailId: resendData.id
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (err) {
    console.error("❌ Unexpected error in email function:", err);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Internal server error",
        details: err instanceof Error ? err.message : "Unknown error"
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});