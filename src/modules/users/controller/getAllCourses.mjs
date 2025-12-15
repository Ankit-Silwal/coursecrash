import Course from "../../instructor/schemas/courseSchema.mjs";
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "published" }, { ownerId: 0, __v: 0 });
    
    if (!courses || courses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No published courses available",
        data: {
          courses: [],
          count: 0
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "All published courses retrieved successfully",
      data: {
        courses,
        count: courses.length
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving courses",
      error: error.message
    });
  }
};
