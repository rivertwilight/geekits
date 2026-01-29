import { Metadata } from "next";
import { isCapacitor } from "@/utils/platform";
import { defaultLocale } from "src/site.config";
import siteConfig from "../../../../site.config.js";
import { getAppConfig, getAppDoc } from "@/utils/appData.server";
import getPaths from "@/utils/getPaths";
import AppContainerClient from "./page-client";

export async function generateStaticParams() {
	if (isCapacitor()) {
		return getPaths().map((path) => ({
			id: path.params.id,
		}));
	}

	const paths = ["zh-CN", "en-US"].map((locale) => getPaths(locale)).flat(1);

	return paths.map((path) => ({
		id: path.params.id,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string; lang: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const locale = defaultLocale;

	const appConfig = getAppConfig(id, {
		requiredKeys: [
			"name",
			"seoOptimizedDescription",
			"status",
			"freeSize",
			"platform",
			"keywords",
			"icon",
		],
		locale: locale,
	});

	const appTitle = appConfig.name;
	const appDescription =
		appConfig.seoOptimizedDescription || appConfig.description || "";
	const appUrl = `${siteConfig.root}/app/${id}`;

	// Use app icon if available, otherwise fall back to general OG image
	const ogImageUrl =
		appConfig.icon && !appConfig.icon.startsWith("/api/")
			? `${siteConfig.root}${appConfig.icon}`
			: `${siteConfig.root}/image/general_og.png`;

	return {
		title: appTitle,
		description: appDescription,
		keywords: appConfig.keywords,
		openGraph: {
			type: "website",
			locale: "en_US",
			url: appUrl,
			siteName: siteConfig.appName,
			title: appTitle,
			description: appDescription,
			images: [
				{
					url: ogImageUrl,
					width: 1200,
					height: 630,
					alt: appTitle,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: appTitle,
			description: appDescription,
			images: [ogImageUrl],
			creator: siteConfig.author.twitter
				? siteConfig.author.twitter.replace(
						/^https?:\/\/(www\.)?(x\.com|twitter\.com)\//,
						"",
					)
				: undefined,
		},
	};
}

export default async function AppPage({
	params,
}: {
	params: Promise<{ id: string; lang: string }>;
}) {
	const { id } = await params;
	const locale = defaultLocale;

	const appConfig = getAppConfig(id, {
		requiredKeys: [
			"name",
			"seoOptimizedDescription",
			"status",
			"freeSize",
			"platform",
			"keywords",
		],
		locale: locale,
	});

	const appDoc = getAppDoc(id);

	const dic = require("../../../../data/i18n.json");

	const currentPage = {
		title: appConfig.name,
		keywords: appConfig.keywords,
		description:
			appConfig.seoOptimizedDescription || appConfig.description || "",
		path: "/app/" + appConfig.id,
	};

	return (
		<AppContainerClient
			appConfig={appConfig}
			appDoc={appDoc}
			currentPage={currentPage}
			dic={JSON.stringify(dic)}
		/>
	);
}
