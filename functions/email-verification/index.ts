// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface ReqPayload {
  name: string;
  email: string;
  verificationLink: string;
  referrer?: string;
}

console.info("📬 Email function started");

Deno.serve(async (req: Request) => {
  try {
    const { name, email, verificationLink, referrer }: ReqPayload = await req.json();

    if (!name || !email || !verificationLink) {
      console.error("❌ Missing required fields");
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    const html = `
      <div style="font-family: sans-serif; line-height: 1.5">
        <h2>Hi ${name}, 👋</h2>
        <p>You were also convinced by <strong>${referrer || "a friend"}</strong> to join <strong>MinimalMind</strong> — your new personal space to track books, build habits, and grow with clarity.</p>
        <p><a href="${verificationLink}" style="background: #6B3FFF; color: #fff; padding: 10px 18px; border-radius: 6px; text-decoration: none;">Click here to verify your account</a></p>
        <p>We're thrilled to have you onboard. Let the journey begin 🌱📚</p>
        <hr />
        <p style="font-size: 12px; color: gray;">If you didn’t request this, you can ignore this email.</p>
      </div>
    `;

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const sender = Deno.env.get("RESEND_SENDER") || "MinimalMind <onboarding@minimalmind.com>";
    if (!resendKey) throw new Error("Missing RESEND_API_KEY in environment");

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [email],
        subject: `Welcome to MinimalMind, ${name}!`,
        html: html,
      }),
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      console.error("❌ Failed to send email:", errorText);
      return new Response(JSON.stringify({ error: "Email sending failed", details: errorText }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    return new Response(JSON.stringify({ success: true, message: `Email sent to ${email}` }), {
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error("❌ Error in request:", err);
    return new Response(JSON.stringify({ error: "Invalid request or payload" }), { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
});

