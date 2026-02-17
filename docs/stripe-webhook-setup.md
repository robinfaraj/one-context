# Stripe Webhook Setup

OneContext uses Stripe webhooks to handle subscription lifecycle events (checkout, payments, cancellations). The webhook endpoint is `POST /api/billing/webhook`.

## Events Handled

| Event | What it does |
|-------|-------------|
| `checkout.session.completed` | Sets user plan to "pro", creates Subscription record, stores Stripe customer ID |
| `invoice.paid` | Keeps subscription active, updates billing period dates |
| `invoice.payment_failed` | Sets subscription status to "past_due" |
| `customer.subscription.updated` | Handles plan changes, cancellation scheduling |
| `customer.subscription.deleted` | Downgrades user to "free", marks subscription canceled |

## Local Development

### 1. Install Stripe CLI

```bash
brew install stripe/stripe-cli/stripe
```

### 2. Login to Stripe

```bash
stripe login
```

This opens a browser window to authenticate with your Stripe account.

### 3. Forward webhooks to localhost

```bash
stripe listen --forward-to localhost:3000/api/billing/webhook
```

The CLI prints a webhook signing secret:

```
> Ready! Your webhook signing secret is whsec_1234abc... (^C to quit)
```

### 4. Add to .env.local

```
STRIPE_WEBHOOK_SECRET=whsec_1234abc...
```

### 5. Test with a trigger

In a separate terminal:

```bash
stripe trigger checkout.session.completed
```

You should see the event logged in both the `stripe listen` terminal and your app server.

## Production (Stripe Dashboard)

### 1. Create the endpoint

1. Go to **Stripe Dashboard > Developers > Webhooks** ([dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks))
2. Click **"Add endpoint"**
3. Set the endpoint URL:
   ```
   https://yourdomain.com/api/billing/webhook
   ```

### 2. Select events

Add these 5 events:

- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### 3. Copy the signing secret

After creating the endpoint, click **"Reveal"** next to the signing secret. Copy the `whsec_...` value and add it to your production environment variables:

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Environment Variables

All Stripe-related env vars (add to `.env.local` for dev, production env for deploy):

```bash
STRIPE_SECRET_KEY=sk_test_...              # Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...            # Webhook signing secret
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_...      # Pro monthly price ID from Stripe
NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID=price_...       # Pro annual price ID from Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Publishable key (client-side)
```

Create price IDs in **Stripe Dashboard > Products**. Create a "Pro" product with two prices: $9/month recurring and $99/year recurring.

## Troubleshooting

**Webhook returns 400 "Invalid webhook signature"**
- Make sure `STRIPE_WEBHOOK_SECRET` matches the secret from `stripe listen` (local) or the dashboard endpoint (production).
- The webhook route reads the raw request body for signature verification. Middleware that parses the body before it reaches the handler will break verification.

**Events not arriving locally**
- Confirm `stripe listen` is running and forwarding to the correct port.
- Check that `pnpm dev` is running and the app is accessible at `localhost:3000`.

**"No such customer" errors after checkout**
- The `checkout.session.completed` handler creates the Stripe customer mapping. If you're testing with a fresh DB, old Stripe customer IDs won't match. Use `stripe trigger` to create fresh test events.
