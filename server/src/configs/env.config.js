import "dotenv/config";

export const env = {
  server: {
    port: process.env.PORT || 5000,
  },

  database: {
    uri: process.env.MONGODB_URI,
  },

  clerk: {
    webhook_secret: process.env.CLERK_WEBHOOK_SECRET,
    secret_key: process.env.CLERK_SECRET_KEY,
  },

  cloudinary: {
    cloudinary_url: process.env.CLOUDINARY_URL,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloud_api_key: process.env.CLOUDINARY_API_KEY,
    cloud_api_secret: process.env.CLOUDINARY_SECRET_KEY,
  },

  stripe: {
    currency: process.env.CURRENCY,
    publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    secret_key: process.env.STRIPE_SECRET_KEY,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  },
};
