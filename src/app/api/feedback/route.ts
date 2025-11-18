import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/EmailTemplate";

const FEISHU_WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

interface FeedbackRequest {
	message: string;
	contact?: string;
	device?: string;
	system?: string;
	appIdentifier?: string;
	appName?: string;
	sourceUrl?: string;
}

async function sendFeishuMessage(data: FeedbackRequest) {
	try {
		const response = await fetch(FEISHU_WEBHOOK_URL!, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				msg_type: "interactive",
				card: {
					schema: "2.0",
					config: {
						wide_screen_mode: true,
					},
					header: {
						title: {
							tag: "plain_text",
							content: "新反馈通知",
						},
						template: "blue",
					},
					body: {
						direction: "vertical",
						elements: [
							{
								tag: "markdown",
								content: data.message,
							},
							{
								tag: "div",
								text: {
									tag: "lark_md",
									content: [
										data.contact
											? `📧 **联系方式**：${data.contact}\n`
											: "",
										`• 设备：${data.device || "未知"}\n`,
										`• 系统：${data.system || "未知"}\n`,
										`• 应用：${
											data.appIdentifier || "未知"
										}\n`,
										`• 来源：${data.sourceUrl || "未知"}\n`,
										`• 时间：${new Date().toLocaleString()}`,
									].join(""),
								},
							},
						],
					},
				},
			}),
		});

		if (!response.ok) {
			throw new Error("Failed to send Feishu message");
		}

		return await response.json();
	} catch (error) {
		console.error("Error sending Feishu message:", error);
		throw error;
	}
}

export async function OPTIONS(request: NextRequest) {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
	});
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const feedbackData: FeedbackRequest = {
			message: body.message,
			contact: body.contact,
			device: body.device,
			system: body.system,
			appIdentifier: body.appIdentifier,
			appName: body.appName || "Geekits",
			sourceUrl: body.sourceUrl,
		};

		if (!feedbackData.message) {
			return NextResponse.json(
				{ error: "Message is required" },
				{ status: 400 }
			);
		}

		// Send Feishu message
		if (FEISHU_WEBHOOK_URL) {
			await sendFeishuMessage(feedbackData);
		}

		return NextResponse.json(
			{ message: "Feedback sent successfully" },
			{
				status: 200,
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			}
		);
	} catch (error) {
		console.error("Error processing feedback:", error);
		return NextResponse.json({ error }, { status: 400 });
	}
}
