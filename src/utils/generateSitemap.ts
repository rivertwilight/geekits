import fs from "fs";
import { root } from "src/site.config";

const SITE_URL = root;

const generateSitemap = (apps) => {
	const links = [
		{
			url: "/",
			changefreq: "daily",
			priority: 1.0,
		},
		...apps,
	];

	// create xml file and save to /public
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${links
			.map((link) => {
				return `
                <url>
                    <loc>${SITE_URL}${link.url}</loc>
                    <changefreq>${link.changefreq}</changefreq>
                    <priority>${link.priority}</priority>
                </url>
            `;
			})
			.join("")}
    </urlset>
    `;

	fs.writeFileSync("./public/sitemap.xml", sitemap, "utf-8");

	return sitemap;
};

export default generateSitemap;
