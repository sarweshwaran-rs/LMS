import express from "express";
import cors from "cors";
import {
  clerkWebhooks,
  stripeWebhooks,
} from "./controllers/webhooks.controller.js";
import { clerkMiddleware } from "@clerk/express";
import educatorRouter from "./routes/educator.route.js";
import courseRouter from "./routes/course.route.js";
import userRouter from "./routes/user.route.js";

// Initialize Express
const app = express();

// Middlewares
app.use(cors());
app.use(clerkMiddleware());

// Routes
app.get("/", (request, response) => response.status(200).send("API Working!"));
app.post("/clerk", express.json(), clerkWebhooks);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);

export default app;
