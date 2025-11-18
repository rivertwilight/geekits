"use client";

import React, { useState, lazy, Suspense } from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import {
	AppsRounded,
	AccountCircle,
	AutoAwesomeRounded,
} from "@mui/icons-material";
import Link from "next/link";
import { Theme, useMediaQuery, Grid, Chip, Tooltip } from "@mui/material";
import { useSidebar } from "@/contexts/sidebar";
import siteConfig from "src/site.config";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { isWeb } from "@/utils/platform";
import Text from "./i18n";
import { Capacitor } from "@capacitor/core";
import Search from "@/components/SearchBox";
import { AppData } from "@/types/index";

function ElevationScroll(props: Props) {
	const { children } = props;

	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0,
	});

	return React.cloneElement(children, {
		elevation: trigger ? 3 : 0,
		sx: {
			borderBottom: trigger ? "" : "none",
		},
	});
}

interface Props {
	children: React.ReactElement;
}

function AppsMenu() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [hoverDescription, setHoverDescription] = useState<string>(
		"Discover more apps from YGeeker",
	);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const apps = [
		{
			name: "ClipMemo",
			icon: "https://www.ygeeker.com/image/product/clipmemo.png",
			link: "https://www.ygeeker.com/clipmemo",
		},
		{
			name: "Dali",
			icon: "https://www.ygeeker.com/image/product/dali.png",
			link: "https://www.ygeeker.com/dali",
		},
		{
			name: "I Didn't",
			icon: "https://www.ygeeker.com/image/product/ididnt.png",
			link: "https://www.ygeeker.com/ididnt",
		},
		{
			name: "FlowFerry",
			icon: "https://www.ygeeker.com/image/product/flowferry.png",
			link: "https://www.ygeeker.com/flowferry",
		},
		{
			name: "Currates",
			icon: "https://www.ygeeker.com/image/product/currates.png",
			link: "https://www.ygeeker.com/currates",
		},
		{
			name: "Timeline",
			icon: "https://www.ygeeker.com/image/product/timeline.png",
			link: "https://www.ygeeker.com/timeline",
		},
	];

	return (
		<>
			<IconButton onClick={handleClick} size="large">
				<AppsRounded />
			</IconButton>
			<Popover
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				sx={{
					"& .MuiPopover-paper": {
						borderRadius: "16px",
						background: (theme) => theme.palette.background.paper,
						width: "320px",
						padding: "24px",
						boxShadow: (theme) => theme.shadows[3],
					},
				}}
			>
				<Typography
					variant="h6"
					gutterBottom
					sx={{
						fontWeight: 500,
						marginBottom: "16px",
						fontFamily: "Product Sans",
					}}
				>
					<Text k="navbar.more.title" />
				</Typography>
				<Grid container spacing={2}>
					{apps.map((app, index) => (
						<Grid item xs={4} key={index}>
							<Link legacyBehavior href={app.link} passHref>
								<Box
									component="a"
									target="_blank"
									rel="noopener noreferrer"
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										cursor: "pointer",
										padding: "8px",
										borderRadius: "12px",
										transition: "background-color 0.2s",
										"&:hover": {
											backgroundColor: (theme) =>
												theme.palette.action.hover,
										},
										textDecoration: "none",
										color: "inherit",
									}}
									onMouseEnter={() =>
										setHoverDescription(app.description)
									}
								>
									<Box
										sx={{
											width: 56,
											height: 56,
											borderRadius: "12px",
											overflow: "hidden",
											marginBottom: "8px",
											boxShadow: (theme) =>
												theme.shadows[1],
										}}
									>
										<Image
											src={app.icon}
											alt={app.name}
											width={56}
											height={56}
										/>
									</Box>
									<Typography
										variant="body2"
										align="center"
										sx={{ fontWeight: 500 }}
									>
										{app.name}
									</Typography>
								</Box>
							</Link>
						</Grid>
					))}
				</Grid>
				{/* <Typography
					variant="caption"
					sx={{
						display: "block",
						textAlign: "center",
						marginTop: "16px",
						minHeight: "2em",
					}}
				>
					{hoverDescription}
				</Typography> */}
			</Popover>
		</>
	);
}

const AccountPanel = lazy(() => import("./AccountPanel"));

export default (props: {
	title: string;
	PageAction;
	repo: string;
	appData: AppData[];
}) => {
	const { title, PageAction, appData } = props;

	const { sidebar, setSidebar } = useSidebar();
	const [showLoginDialog, setShowLoginDialog] = useState(false);
	const hidden = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.only("xs"));
	const pathname = usePathname();
	const isRootRoute = pathname === "/";

	const [showGetAppChip, setShowGetAppChip] = useState(true);

	return (
		<>
			<ElevationScroll {...props}>
				<AppBar
					color="secondary"
					position="fixed"
					sx={{
						zIndex: (theme) => theme.zIndex.drawer + 1,
					}}
				>
					<Toolbar
						sx={{
							bgcolor: (theme) =>
								theme.palette.background.default,
							justifyContent: "space-between",
							paddingTop: "var(--ion-safe-area-top)",
						}}
					>
						<IconButton
							edge="start"
							size="large"
							aria-label="Toggle drawer"
							onClick={() => setSidebar(!sidebar)}
						>
							<MenuTwoToneIcon />
						</IconButton>

						<Box
							sx={{
								flexGrow: 1,
								display: "flex",
								alignItems: "center",
							}}
						>
							<Link href="/" legacyBehavior>
								<Typography
									component="span"
									variant="h6"
									color="textPrimary"
									sx={{
										fontFamily: "Product Sans",
										cursor: "pointer",
									}}
								>
									{siteConfig.appName}
								</Typography>
							</Link>
							<Typography
								id="navbar-localTitle"
								color="primary"
								variant="h6"
								noWrap
								sx={{
									overflow: "hidden",
									fontFamily: "Product Sans",
									marginLeft: ".4em",
								}}
							>
								{title}
							</Typography>
						</Box>

						<Box sx={{ flexGrow: 1 }} />

						{!isXs && (
							<Box
								sx={{
									maxWidth: "500px",
									width: "100%",
									marginX: "16px",
								}}
							>
								<Search appData={appData} />
							</Box>
						)}

						<Box sx={{ flexGrow: 1 }} />

						{!isXs && showGetAppChip && isWeb() && (
							<Tooltip
								title={<Text k="navbar.downloadApp.tooltip" />}
							>
								<Chip
									icon={<AutoAwesomeRounded />}
									label={
										<Text k="navbar.downloadApp.label" />
									}
									onDelete={() => setShowGetAppChip(false)}
									clickable
									sx={{
										mr: 2,
										background:
											"linear-gradient(45deg, #27ae60 30%, #2980b9 90%)",
										color: "white",
										"& .MuiChip-icon": {
											color: "white",
										},
										"& .MuiChip-deleteIcon": {
											color: "white",
										},
									}}
									onClick={() => {
										window.open(
											"https://www.ygeeker.com/geekits",
											"_blank",
										);
									}}
								/>
							</Tooltip>
						)}
						{PageAction}

						{(isRootRoute || !hidden) && <AppsMenu />}

						{(!hidden || isRootRoute) &&
							!Capacitor.isNativePlatform() && (
								<>
									<IconButton
										onClick={() => setShowLoginDialog(true)}
										size="large"
									>
										<AccountCircle />
									</IconButton>
								</>
							)}
					</Toolbar>
				</AppBar>
			</ElevationScroll>
			{showLoginDialog && (
				<Suspense fallback={<Box />}>
					<AccountPanel
						open={showLoginDialog}
						onClose={() => setShowLoginDialog(false)}
					/>
				</Suspense>
			)}
		</>
	);
};
