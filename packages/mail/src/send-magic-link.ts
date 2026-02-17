import { sendViaResend } from "./resend";

interface SendMagicLinkEmailOptions {
	to: string;
	url: string;
	from: string;
}

function renderMagicLinkHtml(url: string): string {
	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;padding:40px 0;">
  <div style="background-color:#ffffff;margin:0 auto;padding:40px 20px;max-width:560px;border-radius:8px;">
    <p style="font-size:24px;font-weight:bold;color:#111827;margin-bottom:16px;">Sign in to OneContext</p>
    <p style="font-size:16px;color:#374151;line-height:24px;">Click the button below to sign in to your account. This link expires in 10 minutes.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${url}" style="background-color:#111827;color:#ffffff;font-size:16px;font-weight:bold;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Sign in to OneContext</a>
    </div>
    <p style="font-size:14px;color:#6b7280;line-height:20px;">Or copy and paste this link into your browser: <a href="${url}" style="color:#2563eb;">${url}</a></p>
    <p style="font-size:12px;color:#9ca3af;margin-top:32px;">If you didn't request this email, you can safely ignore it.</p>
  </div>
</body>
</html>`;
}

export async function sendMagicLinkEmail({
	to,
	url,
	from,
}: SendMagicLinkEmailOptions): Promise<void> {
	const html = renderMagicLinkHtml(url);

	await sendViaResend({
		from,
		to,
		subject: "Sign in to OneContext",
		html,
	});
}
