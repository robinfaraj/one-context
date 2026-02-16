"use client";

import {
	CTASection,
	Features,
	Footer,
	Hero,
	HowItWorks,
	IntegrationSection,
	Navbar,
	ProblemSection,
} from "@ui/components/landing";
import IntegrationsHubSection from "@ui/components/ui/integrations-component";

export default function HomePage() {
	return (
		<main className="min-h-screen bg-background text-foreground">
			<Navbar />
			<Hero />
			<ProblemSection />
			<HowItWorks />
			<Features />
			<IntegrationsHubSection />
			<IntegrationSection />
			<CTASection />
			<Footer />
		</main>
	);
}
