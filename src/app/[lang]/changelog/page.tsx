import { Metadata } from "next";
import ChangelogClient from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "更新公告",
	};
}

export default function ChangelogPage() {
	const dic = require("../../../data/i18n.json");

	const currentPage = {
		title: "更新公告",
		path: "/changelog",
	};

	return (
		<ChangelogClient
			currentPage={currentPage}
			dic={JSON.stringify(dic)}
			locale="zh-CN"
		/>
	);
}
