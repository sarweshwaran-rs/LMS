import app from "./app.js";
import { connectDB } from "./configs/db.config.js";
import { env } from "./configs/env.config.js";

const startServer = async () => {
  await connectDB();

  app.listen(env.server.port, () => {
    console.info(`App running in http://localhost:${env.server.port}`);
  });
};

startServer();
