import React from "react";
import { Metadata } from "next";
import { isCapacitor } from "@/utils/platform";
import { defaultLocale } from "src/site.config";
import { getAppConfig, getAppDoc } from "@/utils/appData";
import getPaths from "@/utils/getPaths";
import generateSitemap from "@/utils/generateSitemap";
import AppContainerClient from "./page-client";

export async function generateStaticParams() {
	if (isCapacitor()) {
		return getPaths().map((path) => ({
			id: path.params.id,
		}));
	}

	const paths = ["zh-CN", "en-US"].map((locale) => getPaths(locale)).flat(1);

	generateSitemap(
		paths.map((p) => {
			return {
				url: `/app/` + p.params.id,
				changefreq: "monthly",
				priority: 0.7,
			};
		})
	);

	return paths.map((path) => ({
		id: path.params.id,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: { id: string };
}): Promise<Metadata> {
	const { id } = params;
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

	return {
		title: appConfig.name,
		description:
			appConfig.seoOptimizedDescription || appConfig.description || "",
		keywords: appConfig.keywords,
	};
}

export default async function AppPage({ params }: { params: { id: string } }) {
	const { id } = params;
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

	const dic = require("../../../data/i18n.json");

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
