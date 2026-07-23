import "dotenv/config"

export const env = {
  server: {
    port: process.env.PORT || 5000,
  },

  database: {
    uri: process.env.MONGODB_URI,
  },

  clerk: {
    webhook_secret: process.env.CLERK_WEBHOOK_SECRET,
  },
}
