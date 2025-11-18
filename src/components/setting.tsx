import * as React from "react";
import Link from "next/link";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AssistantIcon from "@mui/icons-material/Assistant";
import BrushSharpIcon from "@mui/icons-material/BrushSharp";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import TwitterIcon from "@mui/icons-material/Twitter";

// FIXME crash on mobile devices

// ?
export async function getStaticProps({ locale }) {
	const pageDic = require("../data/i18n/" + locale + "/page.js")["/setting"];

	const { title } = pageDic;

	return {
		props: {
			currentPage: {
				title,
				path: "/setting",
			},
			locale,
			pageDic,
		},
	};
}

const LinkList = function ({ link, Icon, primary, secondary }) {
	return (
        <Link key={link} href={link}>
            {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
            }
            <ListItem component={"a"} button>
				{Icon && <ListItemIcon>{Icon}</ListItemIcon>}
				<ListItemText secondary={secondary} primary={primary} />
			</ListItem>
        </Link>
    );
};

interface ISetting {
	homeShowNewestTool?: boolean;
	hitokotoTopic?: number;
	theme?: number;
}

function updateSetting<T extends keyof ISetting>(
	name?: T,
	value?: any
): ISetting {
	var originSetting: ISetting = JSON.parse(
		(window && window.localStorage.getItem("setting")) ||
			`{hitokotoTopic: 1,
			theme: 1,
			homeShowNewestTool: true,}`
	);
	console.log(originSetting);
	if (!name) return originSetting;
	originSetting[name] = value;
	window.localStorage.setItem("setting", JSON.stringify(originSetting));
	// console.log(originSetting);
	return originSetting;
}

const hitokotoItems = [
	{
		name: "随机",
		value: "",
	},
	{
		name: "动漫",
		value: "a",
	},
	{
		name: "漫画",
		value: "b",
	},
	{
		name: "游戏",
		value: "c",
	},
	{
		name: "小说",
		value: "d",
	},
	{
		name: "原创",
		value: "e",
	},
	{
		name: "网络",
		value: "f",
	},
	{
		name: "其他",
		value: "g",
	},
];

const themeItems = [
	{
		name: "跟随系统",
		value: "auto",
	},
	{
		name: "浅色模式",
		value: "light",
	},
	{
		name: "深色模式",
		value: "dark",
	},
];

// ? CF
export default class Setting extends React.Component<
	{ handleNewPage: any },
	{
		setting: ISetting;
		privacy: string;
		showPrivacy: boolean;
		showSaying: boolean;
		showDonation: boolean;
		showTheme: boolean;
	}
> {
	constructor(props: Readonly<{ handleNewPage: any }>) {
		super(props);
		this.state = {
			setting: {},
			privacy: "",
			showPrivacy: false,
			showSaying: false,
			showDonation: false,
			showTheme: false,
		};
	}
	componentDidMount() {
		// window.setHeaderButton(null);
		this.setState({
			setting: updateSetting(),
		});
		// fetch(PrivacyPath.default)
		// 	.then((response) => {
		// 		return response.text();
		// 	})
		// 	.then((text) => {
		// 		this.setState({
		// 			privacy: text,
		// 		});
		// 	});
	}
	handleShowPrivacy = () => {
		this.setState({
			showPrivacy: true,
		});
	};
	handleShowDonation = () => {
		this.setState({
			showDonation: true,
		});
	};
	handleShowSaying = () => {
		this.setState({
			showSaying: true,
		});
	};
	handleShowTheme = () => {
		this.setState({
			showTheme: true,
		});
	};
	handleClose = () => {
		this.setState({
			showPrivacy: false,
			showDonation: false,
			showSaying: false,
			showTheme: false,
		});
	};
	render() {
		const { hitokotoTopic, theme } = this.state.setting;
		const { showSaying, showDonation, showTheme } = this.state;
		const { pageDic: d } = this.props;
		return (
			<Grid sm={9}>
				<Dialog
					onClose={this.handleClose}
					aria-labelledby="simple-dialog-title"
					open={showDonation}
				>
					<DialogTitle id="simple-dialog-title">
						支持我们走下去
					</DialogTitle>
					<DialogContent>
						<Typography align="center" variant="body1">
							<img
								alt="DonationByScanning"
								width="200"
								height="200"
								src="/donation_vx.png"
							></img>
							<br />
							目前网站只由我一人维护，
							需要付出昂贵的资金、精力和时间成本，
							而我只是一名在读高中生，没有任何收入来源。
							你的帮助有助于我们更快迭代版本。
						</Typography>
					</DialogContent>
				</Dialog>
				<Dialog
					open={showSaying}
					aria-labelledby="saying preference"
					onClose={this.handleClose}
				>
					<DialogTitle>{d.hitokoto_source}</DialogTitle>
					<DialogContent>
						<FormGroup>
							{hitokotoItems.map((item, i) => (
								<FormControlLabel
									control={
										<Checkbox
											checked={hitokotoTopic === i}
											onChange={() => {
												this.setState({
													setting: updateSetting(
														"hitokotoTopic",
														i
													),
												});
											}}
											name="hitokotoTopic"
										/>
									}
									label={hitokotoItems[i].name}
								/>
							))}
						</FormGroup>
					</DialogContent>
				</Dialog>
				<Dialog
					open={showTheme}
					aria-labelledby="theme preference"
					onClose={this.handleClose}
				>
					<DialogTitle>主题</DialogTitle>
					<DialogContent>
						<FormGroup>
							{themeItems.map((item, i) => (
								<FormControlLabel
									key={item.value}
									control={
										<Checkbox
											checked={theme === i}
											onChange={() => {
												this.setState({
													setting: updateSetting(
														"theme",
														i
													),
												});
												window.snackbar({
													message:
														"设置已保存，刷新页面即可生效",
												});
											}}
											name="theme"
										/>
									}
									label={themeItems[i].name}
								/>
							))}
						</FormGroup>
					</DialogContent>
				</Dialog>
				<List
					component={Paper}
					subheader={
						<ListSubheader>{d.menu_customize_title}</ListSubheader>
					}
				>
					{[
						{
							onClick: this.handleShowSaying,
							primary: d.menu_hitokoto_source,
							secondary: hitokotoItems[hitokotoTopic].name,
							Icon: <AssistantIcon />,
						},
						{
							onClick: this.handleShowTheme,
							primary: d.menu_theme,
							secondary: themeItems[theme].name,
							Icon: <BrushSharpIcon />,
						},
					].map(({ onClick, primary, secondary, Icon }, i) => (
						<ListItem button onClick={onClick}>
							<ListItemIcon>{Icon}</ListItemIcon>
							<ListItemText
								primary={primary}
								secondary={secondary}
							/>
						</ListItem>
					))}
				</List>
				<br />

				<List
					component={Paper}
					subheader={
						<ListSubheader>{d.menu_contact_title}</ListSubheader>
					}
				>
					{[
						{
							primary: "联系开发者",
							link: "https://wpa.qq.com/msgrd?v=3&amp;uin=1985386335&amp;site=qq&amp;menu=yes",
						},
					].map(LinkList)}
				</List>
				<br />
				<List
					component={Paper}
					subheader={<ListSubheader>{d.menu_donation}</ListSubheader>}
				>
					<ListItem button onClick={this.handleShowDonation}>
						<ListItemIcon>
							<EmojiFoodBeverageIcon />
						</ListItemIcon>
						<ListItemText primary="捐赠" />
					</ListItem>
					{[
						{
							link: "/privacy",
							primary: d.menu_privacy,
							Icon: <PersonIcon />,
						},
						{
							link: "https://jq.qq.com/?_wv=1027&amp;k=59hWPFs",
							primary: "加入群组",
							Icon: <GroupIcon />,
						},
						{
							link: "https://weibo.com/u/7561197296/home",
							primary: "官方微博",
							secondary: "关注获取开发动态和粉丝福利~",
							Icon: <TwitterIcon />,
						},
					].map(LinkList)}
				</List>
				<br />
				<Typography
					variant="body2"
					color="textSecondary"
					align="center"
				>
					© 2019 - 2021 RiverTwilight
				</Typography>
			</Grid>
		);
	}
}
