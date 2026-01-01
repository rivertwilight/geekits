import "server-only";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import externalApps_zhCN from "../data/zh-CN/externalApps";
import externalApps_enUS from "../data/en-US/externalApps";
import type { AppData } from "@/types/index";

const getAppConfigFile = (appId: string, locale: string): string => {
	const filePath = path.join(
		process.cwd(),
		"src",
		"apps",
		appId,
		`README.${locale}.md`
	);
	return fs.readFileSync(filePath, "utf-8");
};

/**
 * @param appId - 应用 id
 * @param config - 请求的 app 配置，如 `name`, `status`, `platform`
 * @returns 返回一个对象，包含默认的配置和请求的配置
 */
const getAppConfig = (
	appId: string,
	config: {
		requiredKeys?: string[];
		locale?: string;
	} = { locale: "zh-CN" }
): { [key: string]: any } => {
	/**
	 * 使用 gray-matter 解析应用配置文件：
	 * - `data`: 从文件头部 front-matter 中提取的元数据对象（通常是配置参数）
	 * - `content`: 文件的主体内容（通常是 Markdown 或纯文本内容）
	 */
	const { data } = matter(getAppConfigFile(appId, config.locale || "zh-CN"));

	const defaultConfig = {
		platform: ["web", "ios", "android"],
	};

	if (!config.requiredKeys) {
		return { ...defaultConfig, id: appId, ...data };
	}

	/**
	 * 根据 `requiredKeys` 从 `data` 中提取必要的配置项，
	 * 如果某个键不存在，则使用 `null` 作为默认值。
	 */
	const loadedConfig = config.requiredKeys.reduce(
		(acc, key) => {
			acc[key] = data[key] || null;
			return acc;
		},
		{ id: appId } as { [key: string]: any }
	);

	return { ...defaultConfig, ...loadedConfig };
};

/**
 * @param appId - 应用 id
 * @param locale - 设备语言信息
 * @returns 返回一个字符串，内容是该应用的 README 文档
 */
const getAppDoc = (
	appId: string,
	locale?: string
): string | { [locale: string]: string } => {
	if (!locale) {
		return {
			"zh-CN": matter(getAppConfigFile(appId, "zh-CN")).content,
			"en-US": matter(getAppConfigFile(appId, "en-US")).content,
		};
	}

	const { content } = matter(getAppConfigFile(appId, locale));
	return content.toString();
};

const getAllApps = (
	includeExternal: boolean = true,
	locale?: string
): AppData[] => {
	const appsDir = path.join(process.cwd(), "src", "apps");

	// Read all directories in the apps folder
	const appIds = fs
		.readdirSync(appsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	const allApps = appIds
		.map((appId) => {
			if (!locale) {
				return ["zh-CN", "en-US"].map((locale) => {
					return {
						id: appId,
						locale,
						...getAppConfig(appId, { locale }),
					};
				});
			}

			return [{ id: appId, locale, ...getAppConfig(appId, { locale }) }];
		})
		.flat(1);

	let externalApps: AppData[] = [];

	switch (locale) {
		case "zh-CN":
			externalApps = externalApps_zhCN;
			break;
		case "en-US":
			externalApps = externalApps_enUS;
			break;
		default:
			externalApps = externalApps_zhCN;
	}

	return includeExternal
		? [...allApps, ...externalApps]
		: (allApps as AppData[]);
};

export { getAllApps, getAppConfig, getAppDoc };
