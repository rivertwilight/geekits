"use client";

import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAction } from "@/contexts/action";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Text from "@/components/i18n";
import { isWeb } from "@/utils/platform";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "@/contexts/colorMode";
import { Preferences } from "@capacitor/preferences";
import MainSection from "@/components/MainSection";
import Layout from "@/components/Layout";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { useLocale } from "@/contexts/locale";
import { store as frameStore } from "@/utils/Data/frameState";

export default function SettingsClient({
	currentPage,
	dic,
	locale,
}: {
	currentPage: any;
	dic: string;
	locale: string;
}) {
	const { setAction } = useAction();
	const [language, setLanguage] = useState("auto");
	const { mode, setMode } = useColorMode();
	const theme = useTheme();
	const { locale: activeLocale } = useLocale();
	const [framed, setFramed] = useState<Boolean>(true);

	const handleLanguageChange = async (event: SelectChangeEvent) => {
		const newLocale = event.target.value as string;
		setLanguage(newLocale);
		await Preferences.set({
			key: "locale",
			value: newLocale,
		});

		if (isWeb()) {
			const targetPath = `${window.location.origin}/${
				newLocale === "auto" ? "" : newLocale
			}/settings`;
			window.location.href = targetPath;
		} else {
			window.location.reload();
		}
	};

	const handleThemeChange = async (event: SelectChangeEvent) => {
		const newMode = event.target.value as "light" | "dark" | "system";
		setMode(newMode);
		await Preferences.set({
			key: "themeMode",
			value: newMode,
		});
	};

	useEffect(() => {
		setAction(null);
	}, [setAction]);

	useEffect(() => {
		const unsubscribe = frameStore.subscribe(() =>
			setFramed(frameStore.getState().value)
		);
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		const loadStoredPreferences = async () => {
			try {
				const { value: storedLocale } = await Preferences.get({
					key: "locale",
				});
				if (storedLocale) {
					setLanguage(storedLocale);
				}
			} catch (error) {
				console.error("Error loading stored preferences:", error);
			}
		};

		loadStoredPreferences();
	}, []);

	const localizedDic = useMemo(
		() => JSON.parse(dic)[activeLocale],
		[activeLocale, dic]
	);

	return (
		<Text dictionary={localizedDic || {}} language={activeLocale}>
			<Layout appData={[]} currentPage={currentPage} enableFrame={framed}>
				<MainSection>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 3,
							width: "100%",
						}}
					>
						{/* Language Setting */}
						<Box
							display={"flex"}
							sx={{
								width: "100%",
							}}
							justifyContent={"space-between"}
							alignItems={"center"}
						>
							<Typography variant="body1">
								<Text k="settings.language.title" />
							</Typography>

							<Box sx={{ flexGrow: 1 }} />

							<FormControl sx={{ width: 180 }}>
								<InputLabel id="settings-language-label">
									<Text k="settings.language.title" />
								</InputLabel>
								<Select
									labelId="settings-language-label"
									id="settings-language"
									name="language"
									value={language}
									onChange={handleLanguageChange}
									label={<Text k="settings.language.title" />}
								>
									<MenuItem value={"auto"}>
										<Text k="settings.language.auto" />
									</MenuItem>
									<MenuItem value={"zh-CN"}>
										<Text k="settings.language.zh_cn" />
									</MenuItem>
									<MenuItem value={"en-US"}>
										<Text k="settings.language.en_us" />
									</MenuItem>
								</Select>
							</FormControl>
						</Box>

						{/* Theme Setting */}
						<Box
							display={"flex"}
							sx={{
								width: "100%",
							}}
							justifyContent={"space-between"}
							alignItems={"center"}
						>
							<Typography variant="body1">
								<Text k="settings.theme.title" />
							</Typography>

							<Box sx={{ flexGrow: 1 }} />

							<FormControl sx={{ width: 180 }}>
								<InputLabel id="settings-theme-label">
									<Text k="settings.theme.title" />
								</InputLabel>
								<Select
									labelId="settings-theme-label"
									id="settings-theme"
									value={mode}
									onChange={handleThemeChange}
									label={<Text k="settings.theme.title" />}
								>
									<MenuItem value="system">
										<Text k="settings.theme.system" />
									</MenuItem>
									<MenuItem value="light">
										<Text k="settings.theme.light" />
									</MenuItem>
									<MenuItem value="dark">
										<Text k="settings.theme.dark" />
									</MenuItem>
								</Select>
							</FormControl>
						</Box>
					</Box>
				</MainSection>
			</Layout>
			{process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
				<GoogleAnalytics
					ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}
				/>
			)}
		</Text>
	);
}
