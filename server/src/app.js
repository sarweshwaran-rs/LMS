import express from "express";
import cors from "cors";
import { clerkWebhooks } from "./controllers/webhooks.controller.js";

// Initialize Express
const app = express();

// Middlewares
app.use(cors({}));
app.use("/auth/clerk", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (request, response) => {
  response.status(200).send("API Working!");
});

app.post("/clerk", express.json(), clerkWebhooks);

export default app;
