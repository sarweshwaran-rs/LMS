import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";

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

app.use("/", authRouter);

export default app;
