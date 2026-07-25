import { clerkClient, getAuth } from "@clerk/express";

// Middleware (Protext Educator Routes)
export const protectEducator = async (request, response, next) => {
  try {
    const userId = getAuth(request).userId;
    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata.role !== "educator") {
      response
        .status(401)
        .json({ suceess: false, message: "Unauthorized Access" });
    }

    next();
  } catch (error) {
    response.status(200).json({ success: false, message: error.message });
  }
};
