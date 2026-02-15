import { MetadataRoute } from "next";
import getPaths from "@/utils/getPaths";
import { root } from "src/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
	const paths = ["zh-CN", "en-US"].map((locale) => getPaths(locale)).flat(1);

	const appUrls = paths.map((p) => ({
		url: `${root}/app/${p.params.id}`,
		lastModified: new Date(),
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	return [
		{
			url: root,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		...appUrls,
	];
}
