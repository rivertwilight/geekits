import React from "react";
import { Metadata } from "next";
import { headers } from "next/headers";
import RootLayoutClient from "./layout-client";
import siteConfig from "../site.config.js";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
	return {
		metadataBase: new URL(siteConfig.root),
		title: {
			default: siteConfig.appName,
			template: `%s - ${siteConfig.appName}`,
		},
		description: siteConfig.description,
		keywords: siteConfig.keywords,
		authors: [{ name: siteConfig.author.name }],
		icons: {
			icon: [
				{ url: "/logo/v3/favicon-16x16.png", sizes: "16x16", type: "image/png" },
				{ url: "/logo/v3/favicon-32x32.png", sizes: "32x32", type: "image/png" },
				{ url: "/logo/v3/favicon-96x96.png", sizes: "96x96", type: "image/png" },
			],
			apple: [
				{ url: "/logo/v3/apple-icon-57x57.png", sizes: "57x57" },
				{ url: "/logo/v3/apple-icon-60x60.png", sizes: "60x60" },
				{ url: "/logo/v3/apple-icon-72x72.png", sizes: "72x72" },
				{ url: "/logo/v3/apple-icon-76x76.png", sizes: "76x76" },
				{ url: "/logo/v3/apple-icon-114x114.png", sizes: "114x114" },
				{ url: "/logo/v3/apple-icon-120x120.png", sizes: "120x120" },
				{ url: "/logo/v3/apple-icon-144x144.png", sizes: "144x144" },
				{ url: "/logo/v3/apple-icon-152x152.png", sizes: "152x152" },
				{ url: "/logo/v3/apple-icon-180x180.png", sizes: "180x180" },
			],
			other: [
				{
					rel: "icon",
					url: "/logo/v3/android-icon-192x192.png",
					sizes: "192x192",
					type: "image/png",
				},
			],
		},
		manifest: "/manifest.json",
		other: {
			"apple-itunes-app": `app-id=${siteConfig.appstore?.appId || ""}`,
			"google-play-app": `app-id=${siteConfig.playstore?.appId || ""}`,
			"google-site-verification": "3yqvRLDwkcm7nwNQ5bSG06I4wQ5ASf23HUtcyZIaz3I",
		},
		alternates: {
			canonical: siteConfig.root,
			languages: {
				"zh-CN": `${siteConfig.root}/zh-CN`,
				"en-US": `${siteConfig.root}/en-US`,
			},
		},
	};
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta
					httpEquiv="Content-Security-Policy"
					content="object-src 'none'; base-uri 'none'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https: http: 'nonce-${nonce}'; 'strict-dynamic';"
				/>
				<meta
					name="theme-color"
					media="(prefers-color-scheme: light)"
					content="#ededf4"
				/>
				<meta
					name="theme-color"
					media="(prefers-color-scheme: dark)"
					content="#1d2023"
				/>
				<meta name="renderer" content="webkit" />
				<meta name="force-rendering" content="webkit" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
				<link rel="dns-prefetch" href={siteConfig.apiConfig?.url || ""} />
				<link
					rel="preconnect"
					href={siteConfig.apiConfig?.url || ""}
					crossOrigin="anonymous"
				/>
			</head>
			<body>
				<RootLayoutClient>{children}</RootLayoutClient>
			</body>
		</html>
	);
}
