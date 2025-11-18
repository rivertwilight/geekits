import React from "react";
import { Metadata } from "next";
import { getAllApps } from "@/utils/appData";
import { defaultLocale } from "../site.config";
import translator from "@/utils/translator";
import HomePageClient from "./page-client";
import { isCapacitor } from "@/utils/platform";
import fetch from "node-fetch";

export async function generateMetadata(): Promise<Metadata> {
	const dic = require("../data/i18n.json");
	const trans = new translator(dic, defaultLocale);

	return {
		title: trans.use("homePage.meta.title"),
		description: trans.use("homePage.meta.description"),
	};
}

export default async function HomePage() {
	let appData: any[];
	const locale = defaultLocale;

	if (isCapacitor()) {
		appData = getAllApps(true);

		// Process icons for capacitor
		await Promise.all(
			appData.map(async (app) => {
				if (app.icon && app.icon.startsWith("/api/")) {
					try {
						const iconUrl = `http://localhost:3000${app.icon}`;
						const response = await fetch(iconUrl);
						const arrayBuffer = await response.arrayBuffer();
						const buffer = Buffer.from(arrayBuffer);
						const base64 = buffer.toString("base64");
						const mimeType = response.headers.get("content-type");
						app.icon = `data:${mimeType};base64,${base64}`;
					} catch (error) {
						console.error(
							`Failed to convert icon to base64 for app ${app.id}:`,
							error
						);
					}
				}
			})
		);
	} else {
		// For web, only get apps for current locale to reduce initial payload
		appData = getAllApps(true, locale);
	}

	const dic = require("../data/i18n.json");

	// Write the full app data to public JSON file during build
	if (true) {
		const fs = require("fs");
		const path = require("path");
		const fullAppData = getAllApps(true);

		// Ensure the public/data directory exists
		const publicDir = path.join(process.cwd(), "public", "data");
		fs.mkdirSync(publicDir, { recursive: true });

		fs.writeFileSync(
			path.join(publicDir, "apps.json"),
			JSON.stringify(fullAppData)
		);
	}

	const currentPage = {
		title: new translator(dic, locale).use("homePage.meta.title"),
		description: new translator(dic, locale).use("homePage.meta.description"),
		path: "/",
		dicKey: "homePage.meta.title",
	};

	const filteredAppData = appData.filter((app) => app.status !== "alpha");

	return (
		<HomePageClient
			appData={filteredAppData}
			currentPage={currentPage}
			dic={JSON.stringify(dic)}
			locale={locale}
		/>
	);
}
