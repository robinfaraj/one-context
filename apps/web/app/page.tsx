"use client";

import IntegrationsHubSection from "@ui/components/integrations-component";
import {
	CTASection,
	Features,
	Footer,
	Hero,
	HowItWorks,
	IntegrationSection,
	Navbar,
	ProblemSection,
} from "../modules/(marketing)/components";

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
