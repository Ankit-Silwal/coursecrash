import Enrollment from "../../users/schema/user.enrolmentSchema.mjs";
import Course from "../schemas/courseSchema.mjs";

export const approveEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const instructorId = req.user.userId;

    if (!enrollmentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide the enrollmentId"
      });
    }

    const enrollment = await Enrollment.findOne({ _id: enrollmentId });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    const course = await Course.findOne({ _id: enrollment.courseId });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    if (course.ownerId.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: "You can only approve enrollments for your own courses"
      });
    }

    if (enrollment.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "This enrollment is already approved"
      });
    }

    enrollment.status = "approved";
    await enrollment.save();

    return res.status(200).json({
      success: true,
      message: "Enrollment approved successfully",
      data: {
        enrollmentId: enrollment._id,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        status: enrollment.status
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error approving enrollment",
      error: error.message
    });
  }
};

export const revokeEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const instructorId = req.user.userId;

    if (!enrollmentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide the enrollmentId"
      });
    }

    const enrollment = await Enrollment.findOne({ _id: enrollmentId });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    const course = await Course.findOne({ _id: enrollment.courseId });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    if (course.ownerId.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: "You can only revoke enrollments for your own courses"
      });
    }

    if (enrollment.status === "blocked") {
      return res.status(400).json({
        success: false,
        message: "This enrollment is already revoked"
      });
    }

    enrollment.status = "blocked";
    await enrollment.save();

    return res.status(200).json({
      success: true,
      message: "Enrollment revoked successfully",
      data: {
        enrollmentId: enrollment._id,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        status: enrollment.status
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error revoking enrollment",
      error: error.message
    });
  }
};
