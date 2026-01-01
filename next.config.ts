import type { NextConfig } from "next";

const isCapacitorBuildtime = process.env.CAPACITOR_BUILD === "true";

const nextConfig: NextConfig = {
	...(isCapacitorBuildtime && { output: "export" }),
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	images: {
		imageSizes: [320, 480, 820, 1200, 1600],
		domains: ["i.loli.net", "bgr.com", "www.ygeeker.com", "ygeeker.com"],
		unoptimized: isCapacitorBuildtime,
	},
};

module.exports = nextConfig;
