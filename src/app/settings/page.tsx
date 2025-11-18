import { Metadata } from "next";
import SettingsClient from "./page-client";
import translator from "@/utils/translator";
import { defaultLocale } from "../../site.config";

export async function generateMetadata(): Promise<Metadata> {
	const dic = require("../../data/i18n.json");
	const trans = new translator(dic, defaultLocale);

	return {
		title: "Settings",
		description: trans.use(""),
	};
}

export default function SettingsPage() {
	const dic = require("../../data/i18n.json");

	const currentPage = {
		title: "Settings",
		description: "",
		path: "/settings",
	};

	return (
		<SettingsClient
			currentPage={currentPage}
			dic={JSON.stringify(dic)}
			locale={defaultLocale}
		/>
	);
}
