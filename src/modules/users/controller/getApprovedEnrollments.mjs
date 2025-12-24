import Enrollment from "../schema/user.enrolmentSchema.mjs";
import Course from "../../instructor/schemas/courseSchema.mjs";

export const getApprovedEnrollments = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found in request context",
      });
    }

    const enrollments = await Enrollment.find(
      { userId, status: "approved" },
      { __v: 0 }
    ).lean();

    if (!enrollments.length) {
      return res.status(200).json({
        success: true,
        message: "No approved enrollments found",
        data: {
          enrollments: [],
          count: 0,
        },
      });
    }

    const courseIds = enrollments.map((enr) => enr.courseId);
    const courses = await Course.find(
      { _id: { $in: courseIds } },
      { __v: 0, ownerId: 0 }
    ).lean();

    const courseMap = new Map(
      courses.map((course) => [course._id.toString(), course])
    );

    const result = enrollments.map((enr) => ({
      ...enr,
      course: courseMap.get(enr.courseId.toString()) || null,
    }));

    return res.status(200).json({
      success: true,
      message: "Approved enrollments fetched successfully",
      data: {
        enrollments: result,
        count: result.length,
      },
    });
  } catch (error) {
    console.error("Error fetching approved enrollments:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching approved enrollments",
      error: error.message,
    });
  }
};
