import { stripe } from "./index";

export async function createCheckoutSession({
	userId,
	email,
	priceId,
	successUrl,
	cancelUrl,
	customerId,
}: {
	userId: string;
	email: string;
	priceId: string;
	successUrl: string;
	cancelUrl: string;
	customerId?: string;
}) {
	const session = await stripe.checkout.sessions.create({
		mode: "subscription",
		customer: customerId ?? undefined,
		customer_email: customerId ? undefined : email,
		line_items: [{ price: priceId, quantity: 1 }],
		allow_promotion_codes: true,
		success_url: successUrl,
		cancel_url: cancelUrl,
		metadata: { userId },
		subscription_data: {
			metadata: { userId },
		},
	});

	return { url: session.url, sessionId: session.id };
}
