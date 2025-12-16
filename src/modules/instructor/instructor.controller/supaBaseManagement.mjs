import supabase from "../../../config/supabase.mjs";
import Course from "../schemas/courseSchema.mjs";
import Lesson from "../schemas/lessonSchema.mjs";

export const getsignedurl = async (req, res) => {
  const { courseId, lessonId, fileType } = req.body;
  const { userId, role } = req.user;
  if (role !== "instructor") {
    return res.status(400).json({
      success: false,
      message: "Only instructor can post the shit",
    });
  }
  if (!courseId || !lessonId || !fileType) {
    return res.status(400).json({
      success: false,
      message: "Input all the courseId ,lessonId and filetype",
    });
  }
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(400).json({
      success: false,
      message: "Course was not found",
    });
  }
  if (course.ownerId.toString() !== userId) {
    return res.status(400).json({
      success: false,
      message: "You cannt post on other course",
    });
  }
  if (course.status === "BLOCKED") {
    return res.status(400).json({
      success: false,
      message: "Course is blocked",
    });
  }
  const filePath = `courses/${courseId}/lessons/${lessonId}`;
  const { data, error } = await supabase.storage
    .from(process.env.BUCKET_NAME)
    .createSignedUploadUrl(filePath, 60 * 15);
  if (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate upload URL",
    });
  }
  return res.status(200).json({
    success: true,
    uploadUrl: data.signedUrl,
    filePath,
  });
};

export const putLessonUrl = async (req, res) => {
  const { courseId, lessonId } = req.body;
  if (!courseId || !lessonId) {
    return res.status(400).json({
      success: false,
      message: "Please provide the required values courseId and lessonId",
    });
  }
  const lesson = await Lesson.findOne({ _id: lessonId });
  if (!lesson) {
    return res.status(400).json({
      success: false,
      message: "The required lesson wasnt found in the database sir :(",
    });
  }
  if (lesson.courseId.toString() !== courseId.toString()) {
    return res.status(400).json({
      success: false,
      message: "You cant manipulate others lesson sir :(",
    });
  }
  const path = `courses/${courseId}/lessons/${lessonId}`;
  lesson.contentUrl = path;
  await lesson.save();
  return res.status(200).json({
    success: true,
    message: "The content url was updated",
  });
};

export const getReadUrl = async (req, res) => {
  const { lessonId } = req.body;
  const lesson=await Lesson.findOne({_id:lessonId})
  if(!lesson){
    return res.status(400).json({
      success:false,
      message:"The lesson wasn't found sir"
    })
  }
  const bucket = process.env.BUCKET_NAME;
  const path = lesson.contentUrl
  console.log(path)
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60); //for 60 minutes
  if (error) {
    throw new Error(error.message);
  }
  return res.status(200).json({
    success: true,
    message: "The url is obtained sucessfully",
    url: data.signedUrl,
  });
};
