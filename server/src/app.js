import express from "express";
import cors from "cors";
import { clerkWebhooks } from "./controllers/webhooks.controller.js";

// Initialize Express
const app = express();

// Middlewares
app.use(cors());

// Routes
app.get("/", (request, response) => response.status(200).send("API Working!"));

app.post("/clerk", express.json(), clerkWebhooks);

export default app;
