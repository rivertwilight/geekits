import { NextRequest, NextResponse } from "next/server";
import * as MuiIcons from "@mui/icons-material";
import sharp from "sharp";

// Check all supported icons at https://mui.com/material-ui/material-icons/
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const iconName = searchParams.get("iconName") || "Home";
	const iconColor = searchParams.get("iconColor") || "fff";
	const backgroundColor1 = searchParams.get("backgroundColor1");
	const backgroundColor2 = searchParams.get("backgroundColor2");

	if (!iconName || typeof iconName !== "string") {
		return NextResponse.json(
			{ message: "Invalid icon name" },
			{ status: 400 }
		);
	}

	try {
		const IconComponent = (MuiIcons as any)[iconName];

		if (!IconComponent) {
			return NextResponse.json(
				{
					message: `Icon "${iconName}" not found. Please check the icon name at https://mui.com/material-ui/material-icons/`,
				},
				{ status: 404 }
			);
		}

		// Extract SVG path from MUI icon component
		// MUI icons expose their path data through the default props
		const iconElement = IconComponent({});
		const svgPath = iconElement?.props?.children || "";
		const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#${iconColor}">${svgPath}</svg>`;

		let backgroundFill: string;

		if (backgroundColor1 && backgroundColor2) {
			backgroundFill = `
				<defs>
					<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" style="stop-color:#${backgroundColor1};stop-opacity:1" />
						<stop offset="100%" style="stop-color:#${backgroundColor2};stop-opacity:1" />
					</linearGradient>
				</defs>
				<rect width="200" height="200" fill="url(#grad)"/>
			`;
		} else if (backgroundColor1) {
			backgroundFill = `<rect width="200" height="200" fill="#${backgroundColor1}"/>`;
		} else {
			const color1 = Math.floor(Math.random() * 16777215).toString(16);
			const color2 = Math.floor(Math.random() * 16777215).toString(16);
			backgroundFill = `
				<defs>
					<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" style="stop-color:#${color1};stop-opacity:1" />
						<stop offset="100%" style="stop-color:#${color2};stop-opacity:1" />
					</linearGradient>
				</defs>
				<rect width="200" height="200" fill="url(#grad)"/>
			`;
		}

		const svgBuffer = Buffer.from(`
			<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
				${backgroundFill}
				<g transform="translate(40, 40) scale(10)">
					${svgString}
				</g>
			</svg>
		`);

		const pngBuffer = await sharp(svgBuffer)
			.resize(200, 200)
			.png()
			.toBuffer();

		return new NextResponse(pngBuffer, {
			status: 200,
			headers: {
				"Content-Type": "image/png",
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	} catch (error) {
		console.error("Error generating icon:", error);
		return NextResponse.json(
			{
				message: "Error generating icon",
				error: (error as Error).message,
			},
			{ status: 500 }
		);
	}
}
