import { Router } from "express";
import { updateRoleToEducator, addCourse, getEducatorCourses, getDashboardData, getEnrolledStudentsData } from "../controllers/educator.controller.js";
import { protectEducator } from "../middlewares/auth.middleware.js";
import upload from "../configs/multer.config.js";

const educatorRouter = Router();

// Add Educator Role
educatorRouter.get("/update-role", updateRoleToEducator);
educatorRouter.post("/add-course", upload.single('image'), protectEducator, addCourse)
educatorRouter.get("/courses", protectEducator, getEducatorCourses)
educatorRouter.get("/dashboard", protectEducator, getDashboardData)
educatorRouter.get("/enrolled-students", protectEducator, getEnrolledStudentsData)

export default educatorRouter;
