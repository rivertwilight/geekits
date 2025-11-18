"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Device } from "@capacitor/device";
import { ColorModeProvider } from "@/contexts/colorMode";
import { LocaleProvider } from "@/contexts/locale";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";
import { isWeb } from "@/utils/platform";

async function getDeviceLanguage() {
	let { value } = await Device.getLanguageCode();

	if (value === "en") {
		value = "en-US";
	}
	if (value === "zh") {
		value = "zh-CN";
	}

	return value;
}

export default function RootLayoutClient({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [preferredLocale, setPreferredLocale] = useState("en-US");

	useEffect(() => {
		const readLocaleConfig = async () => {
			try {
				const { value: preferredSet } = await Preferences.get({
					key: "locale",
				});

				if (preferredSet) {
					if (
						preferredSet === "auto" &&
						Capacitor.isNativePlatform()
					) {
						// Use device language on native apps
						setPreferredLocale(await getDeviceLanguage());
					} else if (preferredSet !== "auto" && isWeb()) {
						// Redirect to the new locale on web
						const locales = ["zh-CN", "en-US"];
						let pathLocaleActive = locales.some((locale) => {
							return window.location.pathname.includes(locale);
						});

						if (!pathLocaleActive && preferredSet !== preferredLocale) {
							window.location.href = `/${preferredSet}${window.location.pathname}`;
						}
					} else if (
						preferredSet !== "auto" &&
						Capacitor.isNativePlatform()
					) {
						// Use preferred locale on native apps
						setPreferredLocale(preferredSet);
					}
				}
			} catch (error) {
				console.error("Error reading locale from storage:", error);
			}
		};

		readLocaleConfig();
	}, []);

	return (
		<ColorModeProvider>
			<LocaleProvider
				value={{
					locale: preferredLocale,
					setLocale: setPreferredLocale,
				}}
			>
				{children}
			</LocaleProvider>
		</ColorModeProvider>
	);
}
