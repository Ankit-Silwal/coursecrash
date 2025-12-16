import supabase from "../../../config/supabase.mjs";
import Course from "../schemas/courseSchema.mjs";

export const getsignedurl=async (req,res)=>{
  const {courseId,lessonId,fileType}=req.body;
  const {userId,role}=req.user;
  if(role!=="instructor"){
    return res.status(400).json({
      success:false,
      message:"Only instructor can post the shit"
    });
  }
  if (!courseId || !lessonId || !fileType)
  {
    return res.status(400).json({
      success: false,
      message: "Input all the courseId ,lessonId and filetype"
    });
  }
  const course = await Course.findById(courseId);
  if (!course)
  {
    return res.status(400).json({
      success: false,
      message: "Course was not found"
    });
  }
  if (course.ownerId.toString() !== userId)
  {
    return res.status(400).json({
      success: false,
      message: "You cannt post on other course"
    });
  }
  if (course.status === "BLOCKED")
  {
    return res.status(400).json({
      success: false,
      message: "Course is blocked"
    });
  }
  const filePath = `courses/${courseId}/lessons/${lessonId}`;
  const {data,error}=await supabase
  .storage
  .from(process.env.BUCKET_NAME)
  .createSignedUploadUrl(filePath,60*15);
  if (error)
  {
    return res.status(500).json({
      success: false,
      message: "Failed to generate upload URL"
    });
  }
  return res.status(200).json({
    success: true,
    uploadUrl: data.signedUrl,
    filePath
  });
}
