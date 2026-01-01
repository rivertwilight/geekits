import { NextRequest, NextResponse } from "next/server";
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
		// Fetch the icon SVG from Material Design Icons CDN
		// Convert PascalCase to snake_case for Material Icons naming
		const iconNameSnake = iconName
			.replace(/([A-Z])/g, "_$1")
			.toLowerCase()
			.replace(/^_/, "");

		// Try to fetch the icon from Google Material Symbols
		const iconUrl = `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${iconNameSnake}/default/24px.svg`;
		const iconResponse = await fetch(iconUrl);

		if (!iconResponse.ok) {
			return NextResponse.json(
				{
					message: `Icon "${iconName}" not found. Please check the icon name at https://mui.com/material-ui/material-icons/`,
				},
				{ status: 404 }
			);
		}

		// Get the SVG content and modify fill color
		let svgContent = await iconResponse.text();
		// Replace any existing fill attributes or add fill to svg tag
		svgContent = svgContent.replace(
			/<svg([^>]*)>/,
			`<svg$1 fill="#${iconColor}">`
		);

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

		// Extract the inner content of the icon SVG (paths, etc.)
		const innerSvgMatch = svgContent.match(/<svg[^>]*>(.*)<\/svg>/s);
		const innerSvg = innerSvgMatch ? innerSvgMatch[1] : "";

		const svgBuffer = Buffer.from(`
			<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
				${backgroundFill}
				<g transform="translate(50, 50) scale(4.16)">
					${innerSvg}
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
