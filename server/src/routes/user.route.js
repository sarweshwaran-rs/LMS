import { Router } from "express";
import {
  getUserData,
  getUserEnrolledCourses,
  purchaseCourse,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/data", getUserData);
userRouter.get("/enrolled-courses", getUserEnrolledCourses);
userRouter.post("/purchase", purchaseCourse);

export default userRouter;
