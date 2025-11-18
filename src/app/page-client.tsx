"use client";

import React, { useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AppList from "@/components/AppGallery";
import Search from "@/components/SearchBox";
import Tips from "@/components/Tips";
import Bookmark from "@/components/Bookmark";
import channelInfo from "@/data/channelInfo";
import { useAction } from "@/contexts/action";
import { useLocale } from "@/contexts/locale";
import { Theme, useMediaQuery } from "@mui/material";
import MainSection from "@/components/MainSection";
import Layout from "@/components/Layout";
import Text from "@/components/i18n";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { store as frameStore } from "@/utils/Data/frameState";

export default function HomePageClient({
	appData,
	currentPage,
	dic,
	locale,
}: {
	appData: any[];
	currentPage: any;
	dic: string;
	locale: string;
}) {
	const { setAction } = useAction();
	const { locale: activeLocale } = useLocale();
	const [framed, setFramed] = React.useState<Boolean>(true);

	useEffect(() => {
		setAction(null);
	}, []);

	useEffect(() => {
		const unsubscribe = frameStore.subscribe(() =>
			setFramed(frameStore.getState().value)
		);
		return () => unsubscribe();
	}, []);

	const localizedAppData = useMemo(
		() => appData.filter((app) => app.locale === activeLocale),
		[activeLocale, appData]
	);

	const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.only("xs"));

	const localizedDic = useMemo(
		() => JSON.parse(dic)[activeLocale],
		[activeLocale, dic]
	);

	return (
		<Text dictionary={localizedDic || {}} language={activeLocale}>
			<Layout
				appData={appData}
				currentPage={currentPage}
				enableFrame={framed}
			>
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
							<Bookmark />
						</Grid>
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
						<Grid
							size={{
								xs: 12,
							}}
						>
							<Tips />
						</Grid>
					</Grid>
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
