import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import GoogleIcon from "@mui/icons-material/Google";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { AppListItem } from "../AppGallery";
import pinyin from "js-pinyin";
import useEventListener from "@/utils/Hooks/useEventListener";
import type { AppData } from "@/types/index";
import { InputBase } from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import { alpha } from "@mui/material/styles";
import useSWR from "swr";
import { useLocale } from "@/contexts/locale";

const Shortcuts = ({ kwd }: { kwd: string }) => {
	return (
        <List>
            <Link href={"https://www.google.com/search?q=" + kwd}>
                {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                }
                <ListItem>
					<ListItemButton>
						<ListItemIcon>
							<GoogleIcon />
						</ListItemIcon>
						<ListItemText primary={`使用谷歌搜索"${kwd}"`} />
					</ListItemButton>
				</ListItem>
            </Link>
            <Link href={"https://cn.bing.com/search?q=" + kwd}>
                {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                }
                <ListItem>
					<ListItemButton>
						<ListItemIcon>
							<SearchSharpIcon />
						</ListItemIcon>
						<ListItemText primary={`使用必应搜索"${kwd}"`} />
					</ListItemButton>
				</ListItem>
            </Link>
            <Link href={"https://www.baidu.com/#ie=UTF-8&wd=" + kwd}>
                {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                }
                <ListItem>
					<ListItemButton>
						<ListItemIcon>
							<SearchSharpIcon />
						</ListItemIcon>
						<ListItemText primary={`使用百度搜索"${kwd}"`} />
					</ListItemButton>
				</ListItem>
            </Link>
        </List>
    );
};

const SearchResult = ({ result = [], kwd }: any) => {
	if (kwd === "") return null;

	const handleKeydown = (e: any) => {
		if (e.keyCode === 38 || e.keyCode === 40) {
			e.preventDefault();
			setSelectedItem(
				e.keyCode === 38 ? selectedItem - 1 : selectedItem + 1
			);
		} else if (e.keyCode === 13) {
			e.preventDefault();
			handleClick(`/app/${result[selectedItem].id}`);
		}
	};

	const [selectedItem, setSelectedItem] = useState(-1);

	let history = useRouter();
	function handleClick(url: any) {
		history.push(url);
	}

	useEventListener("keydown", handleKeydown);

	return (
		<Box sx={{ padding: 2 }}>
			<List component="div" disablePadding>
				<Grid container spacing={1}>
					{!!result.length &&
						result.map((a: any, i: number) => (
							<Grid
								key={a.id}
								size={{
									xs: 12,
								}}
							>
								<AppListItem
									selected={selectedItem === i}
									key={a.link + a.icon}
									{...a}
								/>
							</Grid>
						))}
				</Grid>
			</List>

			<Shortcuts kwd={kwd} />
		</Box>
	);
};

type Procedure = (...args: any[]) => void;

const debounce = <F extends Procedure>(
	func: F,
	timeout: number = 300
): ((...args: Parameters<F>) => void) => {
	let timer: NodeJS.Timeout;
	return (...args: Parameters<F>) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface SearchProps {
	appData?: AppData[];
}

/**
 * Universal Search Box
 * @param {AppData[]} appData - The app data to search from
 * @returns {JSX.Element} - The search box component
 *
 * If appData is provided, it will use the provided app data.
 * Otherwise, it will fetch the app data from the public/data/apps.json file
 */
const Search = ({ appData: propAppData }: SearchProps) => {
	const [kwd, setKwd] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [activeAppData, setActiveAppData] = useState(propAppData || []);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const { locale } = useLocale();

	// Fetch app data if not provided through props
	const { data: fetchedAppData } = useSWR(
		propAppData ? null : "/data/apps.json",
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			refreshInterval: 24 * 60 * 60 * 1000, // 24 hours
		}
	);

	// Update activeAppData when fetchedAppData is available
	useEffect(() => {
		if (fetchedAppData) {
			setActiveAppData(fetchedAppData);
		}
	}, [fetchedAppData]);

	const localizedAppData = useMemo(
		() =>
			activeAppData?.filter((app: AppData) => app.locale === locale) ||
			[],
		[activeAppData, locale]
	);

	useEffect(() => {
		pinyin.setOptions({ checkPolyphone: false, charCase: 0 });

		const handleSearchKeydown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "k") {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
		};

		document.addEventListener("keydown", handleSearchKeydown);

		return () =>
			document.removeEventListener("keydown", handleSearchKeydown);
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setKwd(e.target.value);
		searchRes();
	};

	const searchRes = debounce(() => search(), 500);

	const search = () => {
		const keyword = kwd.toLowerCase().trim();
		const res = localizedAppData.filter((app) => {
			return (
				pinyin.getFullChars(app.name).toLowerCase().indexOf(keyword) !==
					-1 ||
				(app.name.toLowerCase().indexOf(keyword) !== -1 &&
					kwd !== "") ||
				app.link === kwd
			);
		});
		setSearchResult(res || []);
	};

	return (
		<Box sx={{ position: "relative", width: "100%" }}>
			<FormControl fullWidth>
				<InputBase
					sx={{
						borderRadius: "28px",
						height: "40px",
						paddingY: 0.5,
						paddingX: 2,
						backgroundColor: (theme) =>
							theme.palette.mode === "light"
								? alpha(theme.palette.common.black, 0.04)
								: alpha(theme.palette.common.white, 0.06),
						border: "none",
						display: "flex",
						alignItems: "center",
						transition: (theme) =>
							theme.transitions.create([
								"background-color",
								"box-shadow",
							]),
						"&:hover": {
							backgroundColor: (theme) =>
								theme.palette.mode === "light"
									? alpha(theme.palette.common.black, 0.06)
									: alpha(theme.palette.common.white, 0.08),
						},
						"&:focus-within": {
							backgroundColor: (theme) =>
								theme.palette.background.paper,
							boxShadow: (theme) =>
								`0 1px 3px 1px ${alpha(
									theme.palette.mode === "light"
										? theme.palette.common.black
										: theme.palette.common.white,
									0.15
								)}`,
						},
					}}
					fullWidth
					inputRef={searchInputRef}
					autoComplete="off"
					id="search"
					type="search"
					aria-label="Type the search keywords here"
					value={kwd}
					onChange={handleChange}
					// placeholder={ReactDOMServer.renderToString(
					// 	<Text k="homePage.searchBarPlaceholder" />
					// )}
					placeholder={"Ctrl / Cmd + K"}
					startAdornment={
						<SearchSharpIcon
							sx={{
								marginRight: 1,
								color: (theme) =>
									alpha(theme.palette.text.primary, 0.6),
							}}
						/>
					}
				/>
			</FormControl>
			{kwd && (
				<Box
					sx={{
						position: "absolute",
						width: "100%",
						left: 0,
						top: "calc(100% + 8px)",
						zIndex: 1200,
						backgroundColor: (theme) =>
							theme.palette.background.paper,
						borderRadius: 2,
						boxShadow: (theme) => theme.shadows[3],
						maxHeight: "70vh",
						overflowY: "auto",
						border: (theme) => `1px solid ${theme.palette.divider}`,
					}}
				>
					<SearchResult kwd={kwd} result={searchResult} />
				</Box>
			)}
		</Box>
	);
};

export default Search;
