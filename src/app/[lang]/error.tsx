"use client";

import Link from "next/link";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Error() {
	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
		>
			<Typography variant="h4">内部服务器错误</Typography>
			<Typography variant="body1">
				哎呀，发生了一些问题！请稍后再试。
			</Typography>
			<br />
			<Link href="/">
				<Button variant="outlined">返回首页</Button>
			</Link>
		</Box>
	);
}
