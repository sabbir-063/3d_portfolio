import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── In-memory rate limiter ────────────────────────────────────────────────────
// Tracks submission timestamps per IP. Resets on cold start (fine for portfolio).
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3;                      // max 3 submissions per IP per hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  rateLimitMap.set(ip, [...timestamps, now]);
  return false;
}

// ── Validators ────────────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Reject if name/message contains URLs — a strong spam signal
const URL_PATTERN = /https?:\/\/|www\.\S+|\.\w{2,}\//i;

function validate(name: string, email: string, message: string): string | null {
  if (!name || !email || !message) return "All fields are required.";
  if (name.length < 2 || name.length > 80) return "Name must be between 2 and 80 characters.";
  if (!EMAIL_REGEX.test(email)) return "Invalid email address.";
  if (message.length < 10) return "Message is too short.";
  if (message.length > 3000) return "Message is too long.";
  if (URL_PATTERN.test(name)) return "Name contains invalid content.";
  if (URL_PATTERN.test(message)) return "Message contains invalid content.";
  return null;
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Get IP for rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, message, _trap } = body as {
    name: string;
    email: string;
    message: string;
    _trap?: string;
  };

  // Honeypot: bots fill hidden fields, humans don't
  if (_trap) {
    // Silently accept so bots think it worked
    return NextResponse.json({ ok: true });
  }

  const validationError = validate(
    String(name ?? ""),
    String(email ?? ""),
    String(message ?? "")
  );
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
  }

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#0f0c1c;color:#ece5fc;border-radius:16px">
          <h2 style="margin:0 0 8px;color:#c7b9f5">New Contact Form Submission</h2>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:16px 0"/>
          <p style="margin:0 0 4px;font-size:12px;color:#aea8be;text-transform:uppercase;letter-spacing:0.08em">From</p>
          <p style="margin:0 0 20px;font-weight:600">${name} &lt;${email}&gt;</p>
          <p style="margin:0 0 4px;font-size:12px;color:#aea8be;text-transform:uppercase;letter-spacing:0.08em">Message</p>
          <p style="margin:0;white-space:pre-wrap;line-height:1.7">${message}</p>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0"/>
          <p style="margin:0;font-size:11px;color:#aea8be">Sent from your portfolio contact form · Reply-To is set to the sender's email</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
}
