import Course from "../schemas/courseSchema.mjs";
export const postCourses = async (req, res) =>
{
  const { title, description } = req.body;
  if (!title)
  {
    return res.status(400).json({
      success: false,
      message: "Please provide a course title"
    });
  }
  const { userId, role } = req.user;
  if (role !== "instructor")
  {
    return res.status(403).json({
      success: false,
      message: "Only instructors can create courses"
    });
  }
  const course = await Course.create({
    title,
    description,
    ownerId: userId,
    status: "draft"
  });
  return res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course
  });
};
