import { logger } from "@onecontext/logs";

const RESEND_API_BASE = "https://api.resend.com";

interface SendEmailOptions {
	from: string;
	to: string;
	subject: string;
	html: string;
}

export async function sendViaResend({
	from,
	to,
	subject,
	html,
}: SendEmailOptions): Promise<void> {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		throw new Error("RESEND_API_KEY is not set");
	}

	const response = await fetch(`${RESEND_API_BASE}/emails`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({ from, to, subject, html }),
	});

	if (!response.ok) {
		const body = await response.json().catch(() => ({}));
		logger.error("Failed to send email via Resend", { to, subject, body });
		throw new Error(`Resend API error: ${response.status}`);
	}

	logger.info("Email sent via Resend", { to, subject });
}
