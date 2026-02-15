import { configure } from "@trigger.dev/sdk/v3";

// Configure the Trigger.dev client
// The TRIGGER_SECRET_KEY env var is automatically picked up by the SDK
configure({
	secretKey: process.env.TRIGGER_SECRET_KEY,
});
