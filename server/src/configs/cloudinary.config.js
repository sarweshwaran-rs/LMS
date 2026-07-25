import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.config.js";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: env.cloudinary.cloud_name,
    api_key: env.cloudinary.cloud_api_key,
    api_secret: env.cloudinary.cloud_api_secret,
    secure: true,
  });
};

export default connectCloudinary;
