import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export async function getStaticProps() {
	const dic = require("../data/i18n.json");

	const pageProps = {
		currentPage: {
			title: "404",
			path: "/",
		},
		dic: JSON.stringify(dic),
	};

	return {
		props: pageProps,
	};
}

export default function Custom404() {
	return (
        <div className="center-with-flex">
            <Image
				alt="Illustration of a 404 page"
				height="200"
				width="200"
				src="/illustration/undraw_taken_re_yn20.svg"
			/>
            <Typography variant="h4">电波无法到达哦</Typography>
            <Typography variant="body1">
				想要的工具不见了？返回首页找找吧！
			</Typography>
            <br />
            <Link href="/">
                {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                }
                <Button variant="outlined">返回首页</Button>
            </Link>
        </div>
    );
}
