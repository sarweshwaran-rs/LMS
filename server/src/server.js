import app from "./app.js";
import connectCloudinary from "./configs/cloudinary.config.js";
import { connectDB } from "./configs/db.config.js";
import { env } from "./configs/env.config.js";

const startServer = async () => {
  await connectDB();
  
  // Connect Cloudinary
  await connectCloudinary();

  app.listen(env.server.port, () => {
    console.info(`App running in http://localhost:${env.server.port}`);
  });
};

startServer();
