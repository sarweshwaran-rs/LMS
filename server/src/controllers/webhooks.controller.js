import { Webhook } from "svix";
import User from "../models/user.model.js";
import { env } from "../configs/env.config.js";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (request, response) => {
  try {
    const whook = new Webhook(env.clerk.webhook_secret);

    const payload = await whook.verify(request.body.toString(), {
      "svix-id": request.headers["svix-id"],
      "svix-timestamp": request.headers["svix-timestamp"],
      "svix-signature": request.headers["svix-signature"],
    });

    const { data, type } = payload;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          imageUrl: data.image_url,
        };

        await User.create(userData);
        response.status(201).json({ success: true });
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        response.status(202).json({ success: true });
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        response.status(200).json({ success: true });
        break;
      }

      default: {
        return response.status(200).json({
          success: true,
          message: "Event Ignored",
        });
      }
    }
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};
