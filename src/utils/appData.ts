// Client-safe stub - actual implementation is in appData.server.ts
// This file exists to allow client components to import it without build errors
// The actual functions should only be called on the server

/**
 * @param appId - 应用 id
 * @param config - 请求的 app 配置，如 `name`, `status`, `platform`
 * @returns 返回一个对象，包含默认的配置和请求的配置
 */
export const getAppConfig = (
	appId: string,
	config: {
		requiredKeys?: string[];
		locale?: string;
	} = { locale: "zh-CN" }
): { [key: string]: any } => {
	throw new Error(
		"getAppConfig can only be called on the server. Import from @/utils/appData.server instead."
	);
};

/**
 * @param appId - 应用 id
 * @param locale - 设备语言信息
 * @returns 返回一个字符串，内容是该应用的 README 文档
 */
export const getAppDoc = (
	appId: string,
	locale?: string
): string | { [locale: string]: string } => {
	throw new Error(
		"getAppDoc can only be called on the server. Import from @/utils/appData.server instead."
	);
};

export const getAllApps = (
	includeExternal?: boolean,
	locale?: string
): any[] => {
	throw new Error(
		"getAllApps can only be called on the server. Import from @/utils/appData.server instead."
	);
};
