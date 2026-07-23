import { Webhook } from "svix";
import User from "../models/user.model.js";
import { env } from "../configs/env.config.js";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (request, response) => {
  try {
    console.log("Webhook Received")
    const whook = new Webhook(env.clerk.webhook_secret);

    await whook.verify(JSON.stringify(request.body), {
      "svix-id": request.headers["svix-id"],
      "svix-timestamp": request.headers["svix-timestamp"],
      "svix-signature": request.headers["svix-signature"],
    });

    const { data, type } = request.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        }

        console.log("Creating user:", userData);

        const user = await User.create(userData);

        console.log("Saved user:", user);

        response.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        }
        await User.findByIdAndUpdate(data.id, userData)
        response.json({})
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id)
        response.json({})
        break;
      }

      default:
        break;
    }
  } catch (error) {
    response.json({ success: false, message: error.message });
  }
};
