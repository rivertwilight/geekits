import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
	return new Stripe(process.env.STRIPE_SECRET_KEY!, {
		apiVersion: "2024-09-30.acacia",
	});
}

export async function POST(request: NextRequest) {
	try {
		const stripe = getStripe();
		const { amount, description } = await request.json();

		// Create a PaymentIntent with the order amount and currency
		const paymentIntent = await stripe.paymentIntents.create({
			amount: parseFloat(amount) * 100, // Stripe expects the amount in cents
			currency: "cny",
			description: description,
		});

		return NextResponse.json(
			{ clientSecret: paymentIntent.client_secret },
			{ status: 200 }
		);
	} catch (err: any) {
		return NextResponse.json(
			{ statusCode: 500, message: err.message },
			{ status: 500 }
		);
	}
}
