require("dotenv").config();

module.exports = {
	env: {
		DOMAIN: process.env.DOMAIN,
		STEAM_API_KEY: process.env.STEAM_API_KEY,
		SESSION_SECRET: process.env.SESSION_SECRET,
		STRIPE_API_KEY: process.env.STRIPE_API_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		JWT_KEY: process.env.JWT_KEY
	}
};