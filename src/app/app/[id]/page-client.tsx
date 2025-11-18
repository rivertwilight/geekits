"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HelpOutlineTwoTone } from "@mui/icons-material";
import { useAction } from "@/contexts/action";
import { useAppBar } from "@/contexts/appBar";
import { useLocale } from "@/contexts/locale";
import AppMenu from "@/components/AppMenu";
import IconButton from "@mui/material/IconButton";
import RightDrawer from "@/components/RightDrawer";
import { isWeb } from "@/utils/platform";
import { styled } from "@mui/material/styles";
import appImportList from "@/utils/appEntry";
import { getAppConfig } from "@/utils/appData";
import { store as frameStore } from "@/utils/Data/frameState";
import Text from "@/components/i18n";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Layout from "@/components/Layout";

const drawerWidth: number = 260;

const PREFIX = "RDrawer";

const classes = {
	content: `${PREFIX}-content`,
	contentShift: `${PREFIX}-contentShift`,
};

const Root = styled("div")<{ freeSize?: boolean }>(
	({ theme }) =>
		({ freeSize }) => ({
			width: "100%",
			height: "100vh",
			paddingTop: "65px",
			[theme.breakpoints.up("sm")]: {
				paddingBottom: "8px",
			},
			[`& .${classes.content}`]: {
				height: "100%",
				overflowY: "auto",
				[theme.breakpoints.up("sm")]: {
					marginRight: "8px",
					borderRadius: "24px",
				},
				marginX: { sm: 4, xs: 0 },
				background: theme.palette.background.paper,
				padding: freeSize ? "0" : "30px",
				flexGrow: 1,
				transition: theme.transitions.create("margin", {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.leavingScreen,
				}),
			},

			[`& .${classes.contentShift}`]: {
				[theme.breakpoints.up("sm")]: {
					transition: theme.transitions.create("margin", {
						easing: theme.transitions.easing.easeOut,
						duration: theme.transitions.duration.enteringScreen,
					}),
					marginRight: drawerWidth,
				},
			},
		})
);

const SidebarToggle = ({ handleToggle }) => {
	return (
		<IconButton
			aria-label="Switch drawer"
			onClick={handleToggle}
			size="large"
		>
			<HelpOutlineTwoTone />
		</IconButton>
	);
};

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		console.error("AppComp error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<h1>
					Something went wrong with this app. Please try again later.
				</h1>
			);
		}

		return this.props.children;
	}
}

export default function AppContainerClient({
	appConfig: initialAppConfig,
	appDoc,
	currentPage,
	dic,
}: {
	appConfig: any;
	appDoc: any;
	currentPage: any;
	dic: string;
}) {
	const [FeedbackComp, setFeedbackComp] = useState(null);
	const [showFeedbackComp, setShowFeedbackComp] = useState(false);
	const [appConfig, setAppConfig] = useState(initialAppConfig);
	const [framed, setFramed] = useState<Boolean>(true);

	const { setAction } = useAction();
	const { appBar, setAppBar } = useAppBar();
	const { locale: activeLocale } = useLocale();
	const params = useParams();
	const id = params.id as string;

	const loadLink =
		appConfig.status === "stable" || appConfig.status === "beta"
			? appConfig.id
			: "__development";

	const AppComp = appImportList[loadLink] as FC;

	useEffect(() => {
		setAction(<SidebarToggle handleToggle={() => setAppBar(!appBar)} />);
	}, [appBar]);

	useEffect(() => {
		if (window.location.search.indexOf("fullscreen=1") !== -1) {
			frameStore.dispatch({ type: "frame/disabled" });
		}

		return () => {
			// window.hideGlobalLoadingOverlay();
		};
	}, []);

	useEffect(() => {
		const unsubscribe = frameStore.subscribe(() =>
			setFramed(frameStore.getState().value)
		);
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (!isWeb()) {
			const localTitle = document.querySelector("#navbar-localTitle");
			const localizedAppConfig = getAppConfig(id, {
				requiredKeys: [
					"name",
					"seoOptimizedDescription",
					"status",
					"freeSize",
					"platform",
				],
				locale: activeLocale,
			});
			setAppConfig(localizedAppConfig);
			if (localTitle) {
				localTitle.textContent = localizedAppConfig.name;
			}
		}
	}, [activeLocale, id]);

	const feedback = useCallback(() => {
		if (!FeedbackComp) {
			// setFeedbackComp(
			//   !FeedbackComp &&
			//   Loadable(() => import("@/components/FeedbackComp"))
			// );
		}
		setShowFeedbackComp(true);
	}, [FeedbackComp]);

	const localizedDic = React.useMemo(
		() => JSON.parse(dic)[activeLocale],
		[activeLocale, dic]
	);

	return (
		<Text dictionary={localizedDic || {}} language={activeLocale}>
			<Layout appData={[]} currentPage={currentPage} enableFrame={framed}>
				<Root freeSize={!!appConfig.freeSize}>
					<div
						className={`${classes.content} ${
							appBar ? classes.contentShift : ""
						} custom-scrollbar`}
					>
						<ErrorBoundary>{AppComp && <AppComp />}</ErrorBoundary>
					</div>
					<RightDrawer onClose={() => setAppBar(!appBar)} open={appBar}>
						<AppMenu
							appDoc={appDoc[activeLocale]}
							feedback={feedback}
							appConfig={appConfig}
						/>
					</RightDrawer>
				</Root>
			</Layout>
			{process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
				<GoogleAnalytics
					ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}
				/>
			)}
		</Text>
	);
}
