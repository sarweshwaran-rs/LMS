import { Webhook } from "svix";
import User from "../models/user.model.js";
import { env } from "../configs/env.config.js";
import Stripe from "stripe";
import Purchase from "../models/purchase.model.js";
import Course from "../models/course.model.js";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (request, response) => {
  try {
    const whook = new Webhook(`${env.clerk.webhook_secret}`);

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
        };

        const user = await User.create(userData);

        return response
          .status(201)
          .json({
            success: true,
            message: `User ${user.name} successfully Created`,
          });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        response
          .status(200)
          .json({
            success: true,
            message: `User ${userData.name} successfully updated`,
          });
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        response
          .status(200)
          .json({ success: true, message: "Successfully Deleted" });
        break;
      }

      default:
        break;
    }
  } catch (error) {
    response.json({ success: false, message: error.message });
  }
};

// Stripe WebHooks
const stripeInstance = new Stripe(`${env.stripe.secret_key}`);

export const stripeWebhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];
  const endpointSecret = env.stripe.webhook_secret;
  let event;
  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (error) {
    console.error(error);
    response.status(400).json({ success: fasle, message: error.message });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentId,
      });
      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(
        purchaseData.courseId.toString(),
      );

      courseData.enrolledStudents.push(userData);
      await courseData.save();

      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      purchaseData.status = "completed";

      await purchaseData.save();
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentId,
      });
      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId)
      purchaseData.status = 'failed'

      await purchaseData.save()
      break;
    }

    // handle other event types
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  response.status(200).json({ received: true });
};
