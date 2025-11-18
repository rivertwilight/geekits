import { Metadata } from "next";
import TermsClient from "./page-client";
import translator from "@/utils/translator";
import { defaultLocale } from "../../../site.config";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "使用条款",
	};
}

export default function TermsPage() {
	const dic = require("../../../data/i18n.json");

	const currentPage = {
		title: "使用条款",
		path: "/terms",
	};

	return (
		<TermsClient
			currentPage={currentPage}
			dic={JSON.stringify(dic)}
			locale={defaultLocale}
		/>
	);
}
