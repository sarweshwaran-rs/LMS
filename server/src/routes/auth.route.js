import { clerkWebhooks } from "../controllers/webhooks.controller.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/clerk", clerkWebhooks);

export default authRouter;
