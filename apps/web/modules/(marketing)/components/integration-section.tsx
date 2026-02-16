"use client";

import { fadeUp, stagger } from "@ui/lib/animations";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { CodeBlock } from "./code-block";
import { SectionHeader } from "./section-header";

const integrationFeatures = [
	"Works with Claude, OpenClaw, Cursor",
	"REST API for custom integrations",
	"npm package for self-hosting",
];

const mcpConfig = `{
  "mcpServers": {
    "onecontext": {
      "command": "npx",
      "args": [
        "@onecontext/mcp-server"
      ],
      "env": {
        "ONECONTEXT_API_KEY":
          "octx_your_key_here"
      }
    }
  }
}`;

export function IntegrationSection() {
	return (
		<section className="border-t border-border bg-muted/50 py-24 md:py-32">
			<div className="container">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					variants={stagger}
					className="mx-auto max-w-3xl"
				>
					<div className="grid items-center gap-12 md:grid-cols-2">
						<div>
							<SectionHeader
								eyebrow="Integration"
								title="One config change. That's it."
								description="Add OneContext to your MCP config and your AI tools instantly know your background, projects, and goals."
								align="left"
							/>
							<motion.div
								variants={fadeUp}
								custom={3}
								className="mt-6 space-y-3"
							>
								{integrationFeatures.map((item) => (
									<div key={item} className="flex items-center gap-3 text-sm">
										<Check className="h-4 w-4 text-primary" />
										<span>{item}</span>
									</div>
								))}
							</motion.div>
						</div>

						<motion.div variants={fadeUp} custom={2}>
							<CodeBlock filename="mcp-config.json" code={mcpConfig} />
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
