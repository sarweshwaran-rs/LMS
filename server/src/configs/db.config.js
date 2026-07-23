import dns from "dns";
dns.setServers(["1.1.1.1"]);
import mongoose from "mongoose";
import { env } from "./env.config.js";

export const connectDB = async () => {
  const uri = env.database.uri;

  if (!uri) {
    console.error("MongoDB URI not found, check the .env file");
    process.exit(1);
  }

  try {
    mongoose.connection.on('connected', () => console.info("Connected to Mongo DB Successfully"))
    await mongoose.connect(`${uri}/lms`, {
      appName:"lms",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
  } catch (error) {
    console.error("Error Occurred when connecting to Mongodb: ", error);
    process.exit(1);
  }
};
