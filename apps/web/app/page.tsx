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

export default function HomePage() {
	return (
		<main className="min-h-screen bg-background text-foreground">
			<Navbar />
			<Hero />
			<ProblemSection />
			<HowItWorks />
			<Features />
			<IntegrationSection />
			<CTASection />
			<Footer />
		</main>
	);
}
