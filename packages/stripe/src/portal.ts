import { stripe } from "./index";

export async function createPortalSession({
	customerId,
	returnUrl,
}: {
	customerId: string;
	returnUrl: string;
}) {
	const session = await stripe.billingPortal.sessions.create({
		customer: customerId,
		return_url: returnUrl,
	});

	return { url: session.url };
}
