import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

export const AVAILABLE_LOCALES = ["zh-CN", "en-US"];
export const DEFAULT_LOCALE = "en-US";

function getLocale(request) {
	// Check for the locale cookie first
	const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
	if (cookieLocale && AVAILABLE_LOCALES.includes(cookieLocale)) {
		return cookieLocale;
	}

	// Fall back to accept-language header
	const headers = {
		"accept-language":
			request.headers.get("accept-language") || DEFAULT_LOCALE,
	};
	const languages = new Negotiator({ headers }).languages();
	return match(languages, AVAILABLE_LOCALES, DEFAULT_LOCALE);
}

export async function proxy(request) {
	const { pathname } = request.nextUrl;

	const pathnameHasLocale = AVAILABLE_LOCALES.some(
		(locale) =>
			pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
	);

	if (pathnameHasLocale) return;

	// Redirect if there is no locale
	const locale = getLocale(request);
	request.nextUrl.pathname = `/${locale}${pathname}`;
	return NextResponse.redirect(request.nextUrl);
}

export const config = {
	matcher: [
		// Skip all internal paths (_next), api routes, images, and other assets
		"/((?!api|_next|_vercel|.*\\..*).*)",
		// Optional: only run on root (/) URL
		"/",
	],
};
