import {
	Body,
	Button,
	Container,
	Head,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
	url: string;
}

export function MagicLinkEmail({ url }: MagicLinkEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Your OneContext login link</Preview>
			<Body style={body}>
				<Container style={container}>
					<Text style={heading}>Sign in to OneContext</Text>
					<Text style={paragraph}>
						Click the button below to sign in to your account. This link expires
						in 10 minutes.
					</Text>
					<Section style={buttonSection}>
						<Button style={button} href={url}>
							Sign in to OneContext
						</Button>
					</Section>
					<Text style={fallback}>
						Or copy and paste this link into your browser:{" "}
						<Link href={url} style={link}>
							{url}
						</Link>
					</Text>
					<Text style={footer}>
						If you didn&apos;t request this email, you can safely ignore it.
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

const body = {
	backgroundColor: "#f6f9fc",
	fontFamily:
		'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
};

const container = {
	backgroundColor: "#ffffff",
	margin: "0 auto",
	padding: "40px 20px",
	maxWidth: "560px",
	borderRadius: "8px",
};

const heading = {
	fontSize: "24px",
	fontWeight: "bold" as const,
	color: "#111827",
	marginBottom: "16px",
};

const paragraph = {
	fontSize: "16px",
	color: "#374151",
	lineHeight: "24px",
};

const buttonSection = {
	textAlign: "center" as const,
	margin: "24px 0",
};

const button = {
	backgroundColor: "#111827",
	color: "#ffffff",
	fontSize: "16px",
	fontWeight: "bold" as const,
	padding: "12px 24px",
	borderRadius: "6px",
	textDecoration: "none",
};

const link = {
	color: "#2563eb",
};

const fallback = {
	fontSize: "14px",
	color: "#6b7280",
	lineHeight: "20px",
};

const footer = {
	fontSize: "12px",
	color: "#9ca3af",
	marginTop: "32px",
};

export default MagicLinkEmail;
