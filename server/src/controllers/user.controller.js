import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";
import Purchase from "../models/purchase.model.js";
import Course from "../models/course.model.js";
import { env } from "../configs/env.config.js";
import Stripe from "stripe";
import { CourseProgress } from "../models/courseProgress.model.js";

// Get User Data
export const getUserData = async (request, response) => {
  try {
    const { userId } = getAuth(request);
    const user = await User.findById(userId);

    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    response.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: error.message });
  }
};

// User Enrolled Courses with Lecture Links
export const getUserEnrolledCourses = async (request, response) => {
  try {
    const { userId } = getAuth(request);
    const userData = await User.findById(userId).populate("enrolledCourses");

    response
      .status(200)
      .json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: error.message });
  }
};

// Purchase Course
export const purchaseCourse = async (request, response) => {
  try {
    const { courseId } = request.body;
    const { origin } = request.headers;
    const userId = getAuth(request).userId;
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return response
        .status(404)
        .json({ success: false, message: "Data Not Found" });
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: Number(
        courseData.coursePrice -
          (courseData.discount * courseData.coursePrice) / 100,
      ).toFixed(2),
    };

    const newPurchase = await Purchase.create(purchaseData);

    // Stripe Geteway Initialize
    const stripeInstance = new Stripe(`${env.stripe.secret_key}`);

    const currency = env.stripe.currency.toLowerCase();

    // Creating line items for Stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.round(Number(newPurchase.amount) * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    response.status(201).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: error.message });
  }
};

// Update User Course Progress
export const updateUserCourseProgress = async (request, response) => {
  try {
    const userId = getAuth(request).userId;
    const { courseId, lectureId } = request.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return response.json({
          success: true,
          message: "Lecture Already Completed",
        });
      }
      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }
    response.status(201).json({ success: true, message: "Progress Updated" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: error.message });
  }
};

// get User Progress
export const getUserCourseProgress = async (request, response) => {
  try {
    const userId = getAuth(request).userId;
    const { courseId } = request.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });
    response.status(200).json({ success: true, progressData });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: error.message });
  }
};

// Add User Ratings to Course
export const addUserRating = async (request, response) => {
  const userId = getAuth(request).userId;
  const { courseId, rating } = request.body;

  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return response
      .status(400)
      .json({ success: false, message: "Invalid Details" });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return response
        .status(404)
        .json({ success: false, message: "Course Not foundnd" });
    }

    const user = await User.findById(userId);

    if (!user || !user.enrolledCourses.includes(courseId)) {
      return response
        .status(404)
        .json({
          success: false,
          message: "User has not purchased this course.",
        });
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId,
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();
    response.status(200).json({ success: true, message: "Rating Added" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: error.message });
  }
};
