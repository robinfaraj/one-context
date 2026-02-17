import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	turbopack: {
		root: "../..",
	},
	transpilePackages: ["@onecontext/api", "@onecontext/auth"],
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "avatars.githubusercontent.com" },
			{ protocol: "https", hostname: "pbs.twimg.com" },
		],
	},
};

export default nextConfig;
