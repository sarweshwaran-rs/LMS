import Course from "../models/course.model.js";

// Get all Courses
export const getAllCourses = async (request, response) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator" });

    response.status(200).json({ success: true, courses });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: error.message });
  }
};

// Get Course by Id
export const getCourseById = async (request, response) => {
  const { id } = request.params;

  try {
    const courseData = await Course.findById(id).populate({ path: "educator" });

    // Remove lectureUrl if isPreview is false
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    response.status(200).json({ success: true, courseData });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, message: error.message });
  }
};

