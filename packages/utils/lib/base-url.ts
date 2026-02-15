export function getBaseUrl() {
	// Use the production URL if available
	// Check both NEXT_PUBLIC_SITE_URL (Next.js) and SITE_URL (Trigger.dev/other runtimes)
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;

	if (siteUrl) {
		return siteUrl;
	}

	// Local development
	return `http://localhost:${process.env.PORT ?? 3000}`;
}
