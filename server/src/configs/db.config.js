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
    await mongoose.connect(`${uri}`);
    console.info("Connected to Mongo DB Successfully");
  } catch (error) {
    console.error("Error Occurred when connecting to Mongodb: ", error);
    process.exit(1);
  }
};
