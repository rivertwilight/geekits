"use client";

import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import OutlinedCard from "@/components/OutlinedCard/index";
import {
	Alert,
	Avatar,
	ListItem,
	ListItemAvatar,
	ListItemText,
} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AttachMoney, Coffee, Fastfood, LocalBar } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Image from "next/image";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
	PaymentElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import Text from "@/components/i18n";
import MainSection from "@/components/MainSection";
import Placeholder from "@/components/Placeholder";
import { usePageTitle } from "@/utils/Hooks/usePageTitle";

const FREE_DONATION_WAYS = [
	{
		title: "支付宝",
		subtitles: ["你可以获得随机红包"],
		price: "¥0.1",
		href: "/image/alipay_pocket.png",
		bgColor: "#0e78ff",
		color: "#fff",
	},
	{
		title: "GitHub",
		subtitles: ["给我打个⭐"],
		price: "¥1.00",
		href: "https://github.com/rivertwilight/ygktool",
		bgColor: "#000",
		color: "#fff",
	},
	{
		title: "DigitalOcean",
		subtitles: ["注册后你可获得 $200"],
		price: "$100",
		href: "https://m.do.co/c/eed8a86797c9",
		bgColor: "linear-gradient(to top right, #031b4e 52%, #00359c)",
		color: "#fff",
	},
	{
		title: "Wise",
		subtitles: ["注册后你可获得 4500 元免费转账额度"],
		price: "¥450",
		href: "https://wise.com/invite/imc/renew279",
		bgColor: "#87eb5c",
		color: "#000",
	},
	{
		title: "N26",
		subtitles: ["注册后你可免费获得德万事达银行卡一张"],
		price: "¥312",
		href: "https://n26.com/r/renjiew1161",
		bgColor: "#36a18c",
		color: "#fff",
	},
	{
		title: "OKX",
		subtitles: ["注册后你可获得神秘盲盒（最高50刀）"],
		price: "$50",
		href: "https://ouxyi.space/join/82087068",
		bgColor: "#000",
		color: "#fff",
	},
];

const PAIED_DONATION_WAYS = [
	{
		title: "请我一杯咖啡",
		amount: 6,
		tag: "¥6.00",
		icon: <Coffee />,
		href: "",
	},
	{
		title: "请我一杯奶茶",
		tag: "¥15.00",
		amount: 15,
		icon: <LocalBar />,
		href: "",
	},
	{
		title: "请我一顿饭",
		tag: "¥25.00",
		amount: 25,
		icon: <Fastfood />,
		href: "",
	},
	{
		title: "自定义金额",
		tag: "",
		icon: <AttachMoney />,
		href: "",
	},
];

const DONATION_HISTORY = [
	{
		amount: "¥80.0",
		donator: "Yunser",
		method: "微信",
	},
	{
		amount: "¥5",
		donator: "SJX",
		method: "微信",
	},
	{
		amount: "⭐️ * 1",
		donator: "Gloridust",
		method: "GitHub",
	},
];

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const ProductItem = ({ href, ...props }) => (
	<Grid
		size={{
			xs: 6,
			sm: 4,
		}}
	>
		<OutlinedCard padding={1}>
			<CardContent>
				<Typography
					sx={{ fontSize: 14 }}
					color="text.secondary"
					gutterBottom
				>
					{props.title}
				</Typography>
				<Typography variant="h5" component="div">
					{props.price}
				</Typography>
				<Typography
					sx={{ height: { xs: "4em", sm: "2em" } }}
					variant="body2"
				>
					{props.subtitles}
				</Typography>
			</CardContent>
			<CardActions>
				<Link href={href} target="_blank">
					<Button
						sx={{
							background: props.bgColor,
							color: props.color,
							marginLeft: "8px",
						}}
						size="small"
					>
						前往
					</Button>
				</Link>
			</CardActions>
		</OutlinedCard>
	</Grid>
);

const PaidOptionItem = ({ href, ...props }) => {
	const [open, setOpen] = useState(false);
	const [paymentIntent, setPaymentIntent] = useState(null);
	const [expandedAccordion, setExpandedAccordion] = useState<string | false>(
		"gumroad",
	);

	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setExpandedAccordion("gumroad");
	};

	const handleAccordionChange =
		(panel: string) =>
		(event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpandedAccordion(isExpanded ? panel : false);
		};

	const handleStripePayment = async () => {
		const response = await fetch("/api/create-payment-intent", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				amount: props.amount,
				description: props.title,
			}),
		});
		const data = await response.json();
		setPaymentIntent(data.clientSecret);
	};

	return (
		<>
			<Grid
				size={{
					xs: 6,
					sm: 4,
				}}
			>
				<OutlinedCard
					padding={1}
					onClick={handleClick}
					sx={{ cursor: "pointer" }}
				>
					<ListItem sx={{ height: { xs: "6em", sm: "4em" } }}>
						<ListItemAvatar>
							<Avatar>{props.icon}</Avatar>
						</ListItemAvatar>
						{!!props.tag ? (
							<ListItemText
								primary={props.title}
								secondary={props.tag}
							/>
						) : (
							<ListItemText primary={props.title} />
						)}
					</ListItem>
				</OutlinedCard>
			</Grid>

			<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
				<DialogTitle>选择支付方式</DialogTitle>
				<DialogContent>
					<Accordion
						expanded={expandedAccordion === "gumroad"}
						onChange={handleAccordionChange("gumroad")}
					>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography>Gumroad</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Button
								fullWidth
								variant="contained"
								color="primary"
								href={`https://ygeeker.gumroad.com/coffee`}
								target="_blank"
								rel="noopener noreferrer"
							>
								通过 Gumroad 支付
							</Button>
						</AccordionDetails>
					</Accordion>
					<Accordion
						expanded={expandedAccordion === "wechat"}
						onChange={handleAccordionChange("wechat")}
					>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography>微信支付</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Box display="flex" justifyContent="center">
								<Image
									src="/image/wechat_6.jpg"
									alt="WeChat QR Code"
									width={200}
									height={200}
									style={{ borderRadius: "8px" }}
								/>
							</Box>
						</AccordionDetails>
					</Accordion>
					<Accordion
						expanded={expandedAccordion === "alipay"}
						onChange={handleAccordionChange("alipay")}
					>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography>支付宝</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Box display="flex" justifyContent="center">
								<Image
									src="/image/alipay_6.jpg"
									alt="Alipay QR Code"
									width={200}
									height={200}
									style={{ borderRadius: "8px" }}
								/>
							</Box>
						</AccordionDetails>
					</Accordion>
					<Accordion
						expanded={expandedAccordion === "stripe"}
						onChange={handleAccordionChange("stripe")}
					>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography>Stripe</Typography>
						</AccordionSummary>
						<AccordionDetails>
							{paymentIntent ? (
								<Elements
									stripe={stripePromise}
									options={{ clientSecret: paymentIntent }}
								>
									<StripePaymentForm />
								</Elements>
							) : (
								<Button
									fullWidth
									variant="contained"
									color="primary"
									onClick={handleStripePayment}
								>
									使用 Stripe 支付
								</Button>
							)}
						</AccordionDetails>
					</Accordion>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						取消
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

const StripePaymentForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [error, setError] = useState(null);
	const [processing, setProcessing] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		setProcessing(true);

		const result = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/donation-success`,
			},
		});

		if (result.error) {
			setError(result.error.message);
		}

		setProcessing(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<PaymentElement />
			<Button
				type="submit"
				fullWidth
				variant="contained"
				color="primary"
				disabled={!stripe || processing}
				sx={{ mt: 2 }}
			>
				{processing ? "处理中..." : "支付"}
			</Button>
			{error && (
				<Typography color="error" sx={{ mt: 2 }}>
					{error}
				</Typography>
			)}
		</form>
	);
};

export default function DonateClient({ currentPage }: { currentPage: any }) {
	usePageTitle(currentPage.title);

	return (
		<MainSection>
			<Alert severity="info">
				以下方式都是免费的，你只需要动动手指，我和你都能从中获益。
			</Alert>
			<Grid
				spacing={{ xs: 1, md: 2 }}
				sx={{ paddingY: (theme) => theme.spacing(1) }}
				container
			>
				{FREE_DONATION_WAYS.map((way) => (
					<ProductItem key={way.title} {...way} />
				))}
			</Grid>

			<br />
			<br />

			<Typography variant="h6">
				<Text k="donation.paid.title" />
			</Typography>

			<br />

			<Grid
				spacing={{ xs: 1, md: 2 }}
				sx={{ paddingY: (theme) => theme.spacing(1) }}
				container
			>
				{PAIED_DONATION_WAYS.map((way) => (
					<PaidOptionItem key={way.title} {...way} />
				))}
			</Grid>

			<br />
			<br />

			<Typography variant="h6">捐赠记录</Typography>

			<br />

			<TableContainer component={OutlinedCard}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>方式</TableCell>
							<TableCell>金额</TableCell>
							<TableCell>捐赠者</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{DONATION_HISTORY.map((row, i) => (
							<TableRow key={i}>
								<TableCell>{row.method}</TableCell>
								<TableCell>{row.amount}</TableCell>
								<TableCell>{row.donator}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<Box
					display={"flex"}
					width={"full"}
					justifyContent={"center"}
					paddingY={2}
				>
					<Button LinkComponent={Link} href="mailto:rene@ygeeker.com">
						问题反馈
					</Button>
				</Box>
			</TableContainer>
			<Box height="56px"></Box>

			<Typography variant="body2" textAlign="center" gutterBottom>
				感谢您对我的开源项目的关注。Toolkits
				已经开发了六年多，这期间我投入了大量的时间、精力和金钱，包括购买域名和服务器。这一切对我来说是非常昂贵的。但是，我仍然坚守着对这个项目的热爱。
				你可以通过捐赠来支持我，帮助我继续开发这个项目，使其对更多人有所帮助。非常感谢你的支持！
				<br />
				<br />
				所有的收益都将用于开发、维护、运行 Toolkits。
			</Typography>
		</MainSection>
	);
}
