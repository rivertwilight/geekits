"use client";

import { useMemo } from "react";
import Grid from "@mui/material/Grid";
import AppList from "@/components/AppGallery";
import Search from "@/components/SearchBox";

import channelInfo from "@/data/channelInfo";
import { useLocale } from "@/contexts/locale";
import { Theme, useMediaQuery } from "@mui/material";
import MainSection from "@/components/MainSection";
import { usePageTitle } from "@/utils/Hooks/usePageTitle";

export default function HomePageClient({
	appData,
	currentPage,
}: {
	appData: any[];
	currentPage: any;
}) {
	const { locale: activeLocale } = useLocale();

	usePageTitle(currentPage.title);

	const localizedAppData = useMemo(
		() => appData.filter((app) => app.locale === activeLocale),
		[activeLocale, appData]
	);

	const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.only("xs"));

	return (
		<MainSection>
			<Grid container direction="row-reverse" spacing={2}>
				{isXs && (
					<Grid
						size={{
							xs: 12,
						}}
					>
						<Search appData={localizedAppData} />
					</Grid>
				)}
				<Grid
					size={{
						xs: 12,
					}}
				>
					<AppList
						channelInfo={channelInfo}
						appData={localizedAppData}
					/>
				</Grid>
			</Grid>
		</MainSection>
	);
}
