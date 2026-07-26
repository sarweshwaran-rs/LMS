import { v2 as cloudinary } from "cloudinary";
import { clerkClient, getAuth } from "@clerk/express";
import Course from "../models/course.model.js";
import Purchase from "../models/purchase.model.js";
import User from "../models/user.model.js";

// Update role to educator
export const updateRoleToEducator = async (request, response) => {
  try {
    const user_Id = getAuth(request).userId;

    await clerkClient.users.updateUserMetadata(user_Id, {
      publicMetadata: {
        role: "educator",
      },
    });

    response
      .status(200)
      .json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    response.status(401).json({ success: false, message: error.message });
  }
};

// Add New Course
export const addCourse = async (request, response) => {
  try {
    const { courseData } = request.body;
    const imageFile = request.file;
    const educator_id = getAuth(request).userId;

    if (!imageFile) {
      return response
        .status(400)
        .json({ success: false, message: "Thumbnail Not Attached" });
    }

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educator_id;

    const newCourse = await Course.create(parsedCourseData);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: `LMS/${educator_id}`,
    });
    newCourse.courseThumbnail = imageUpload.secure_url;

    await newCourse.save();
    response.status(201).json({ success: true, message: "Course Added" });
  } catch (error) {
    console.error(error);
    response.status(400).json({ success: false, message: error.message });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (request, response) => {
  try {
    const educator = getAuth(request).userId;

    const courses = await Course.find({ educator: educator });
    return response.status(200).json({ success: true, courses });
  } catch (error) {
    console.error(error);
    response.status(400).json({ success: false, message: error.message });
  }
};

// Get Educator Dashboard Data
export const getDashboardData = async (request, response) => {
  try {
    const educator = getAuth(request).userId;
    const courses = await Course.find({ educator: educator });
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    // Calculate total earning from purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0,
    );

    // Collect Unique enrolled student Ids with their course titles
    const enrolledStudentsData = [];

    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl",
      );
      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }
    response.status(200).json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: error.message });
  }
};

// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (request, response) => {
  try {
    const educator = getAuth(request).userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");
    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));
    response.status(200).json({ success: true, enrolledStudents });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: error.message });
  }
};
