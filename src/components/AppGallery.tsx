import React, { useMemo } from "react";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import OutlinedCard from "./OutlinedCard";
import type { AppData, IChannel } from "@/types/index.d";
import { Capacitor } from "@capacitor/core";
import Text from "./i18n";
import { Card, ListItemButton } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import AppGridItem from "./AppGridItem";

interface AppListItemProps extends AppData {
	selected?: boolean;
}

const AppListItem = ({
	channel,
	name,
	id,
	description,
	status,
	link,
	selected,
	icon,
}: AppListItemProps) => {
	const isExternal = channel === "external";
	const attr = useMemo(
		() =>
			isExternal
				? {
						// For <a> tag
						href: link,
						target: "_blank",
						rel: "noopener noreferrer",
				  }
				: {
						component: id,
						href: "/app/" + id,
				  },
		[status, id, link, isExternal]
	);

	const Inner = () => (
		<ListItemButton
			sx={{
				height: "93px",
				overflow: "hidden",
				padding: "0 18px",
				borderRadius: "28px",
			}}
			selected={selected}
			key={id}
			itemScope
			itemType="https://schema.org/SoftwareApplication"
		>
			<ListItemAvatar>
				<Avatar
					variant="circular"
					alt={name + "的图标"}
					src={icon}
					itemProp="image"
				/>
			</ListItemAvatar>
			<ListItemText
				sx={{
					"& .MuiListItemText-primary": {
						fontFamily: "Product Sans Bold",
						textDecoration: "none",
					},
					"& .MuiListItemText-secondary": {
						textDecoration: "none",
					},
				}}
				primary={
					<>
						<span itemProp="name">{name}</span>&nbsp;
						{status === "beta" && (
							<Chip
								label={<Text k="channel.wip" />}
								size="small"
								variant="outlined"
							/>
						)}
					</>
				}
				secondary={<span itemProp="description">{description}</span>}
			/>
			<meta itemProp="applicationCategory" content="Utility" />
			<meta itemProp="operatingSystem" content="Web" />
		</ListItemButton>
	);

	if (status === "beta") {
		if (isExternal) {
			return (
				<OutlinedCard>
					<a
						{...attr}
						style={{ textDecoration: "none", display: "block" }}
					>
						<Inner />
					</a>
				</OutlinedCard>
			);
		}
		return (
			<OutlinedCard>
				<Inner />
			</OutlinedCard>
		);
	}

	if (isExternal) {
		return (
			<a {...attr} style={{ textDecoration: "none", display: "block" }}>
				<Card
					sx={{
						textDecoration: "none",
						"&:hover": {
							textDecoration: "none",
						},
					}}
				>
					<Inner />
				</Card>
			</a>
		);
	}

	return (
        <Link {...attr} style={{ textDecoration: "none" }}>
            {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
            }
            <Card
				sx={{
					textDecoration: "none",
					"&:hover": {
						textDecoration: "none",
					},
				}}
			>
				<Inner />
			</Card>
        </Link>
    );
};

const Channel = ({
	info: { name, Icon },
	apps,
	viewMode,
}: {
	apps: AppData[];
	info: IChannel;
	viewMode: "grid" | "list";
}) => {
	if (!!!apps.length) return null;

	const sortedApps = useMemo(
		() => [...apps].sort((a, b) => a.name.localeCompare(b.name)),
		[apps]
	);

	return (
		<>
			<List
				subheader={
					<ListSubheader
						sx={{ background: "unset" }}
						component="div"
						id="nested-list-subheader"
					>
						{name}
					</ListSubheader>
				}
				component="div"
				disablePadding
			>
				<Grid container spacing={2} alignItems="stretch">
					{sortedApps.map((app) => (
						<Grid
							key={app.id}
							component="div"
							size={
								viewMode === "grid"
									? {
											xs: 6,
											sm: 3,
											md: 3,
											lg: 2,
											xl: 2,
									  }
									: {
											xs: 12,
											sm: 6,
											md: 6,
											lg: 4,
											xl: 4,
									  }
							}
							sx={{
								display: "flex",
								"& > *": {
									width: "100%",
									height: "100%",
								},
							}}
						>
							{viewMode === "grid" ? (
								<AppGridItem {...app} />
							) : (
								<AppListItem {...app} />
							)}
						</Grid>
					))}
				</Grid>
			</List>
		</>
	);
};

const AppGallery = ({
	appData,
	channelInfo,
}: {
	appData: AppData[];
	channelInfo;
}) => {
	const [viewMode, setViewMode] = React.useState<"grid" | "list">("list");

	const handleViewChange = (
		event: React.MouseEvent<HTMLElement>,
		newView: "grid" | "list"
	) => {
		if (newView !== null) {
			setViewMode(newView);
		}
	};

	return (
		<>
			<Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
				<ToggleButtonGroup
					value={viewMode}
					exclusive
					onChange={handleViewChange}
					aria-label="view mode"
					size="small"
				>
					<ToggleButton value="list" aria-label="list view">
						<ViewListIcon />
					</ToggleButton>
					<ToggleButton value="grid" aria-label="grid view">
						<GridViewIcon />
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<List aria-labelledby="nested-list-subheader">
				{Object.keys(channelInfo).map((key) => {
					let channelizedApps = appData.filter(
						(app) =>
							app.channel === key &&
							app.platform.includes(Capacitor.getPlatform())
					);
					return (
						<Channel
							info={channelInfo[key]}
							key={key}
							apps={channelizedApps}
							viewMode={viewMode}
						/>
					);
				})}
			</List>
		</>
	);
};

export { AppListItem, Channel };

export default AppGallery;
