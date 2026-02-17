import { OAuthConsentForm } from "@shared/components/auth/oauth-consent-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function OAuthConsentPage() {
	return (
		<div className="flex min-h-svh items-center justify-center bg-background p-4">
			<div className="w-full max-w-md space-y-6">
				<OAuthConsentForm />
			</div>
		</div>
	);
}
