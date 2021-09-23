require("dotenv").config();

module.exports = {
	env: {
		DOMAIN_DEV: process.env.DOMAIN_DEV,
		DOMAIN_PROD: process.env.DOMAIN_PROD,
		APP_ENV: process.env.APP_ENV,
		STEAM_API_KEY: process.env.STEAM_API_KEY,
		SESSION_SECRET: process.env.SESSION_SECRET,
		STRIPE_API_KEY: process.env.STRIPE_API_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		JWT_KEY: process.env.JWT_KEY,
		SUPERADMIN: process.env.SUPERADMIN,
		PAGSEGURO_EMAIL: process.env.PAGSEGURO_EMAIL,
		PAGSEGURO_TOKEN: process.env.PAGSEGURO_TOKEN
	}
};