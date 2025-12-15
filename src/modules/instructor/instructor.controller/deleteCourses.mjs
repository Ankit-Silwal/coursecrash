import Course from "../schemas/courseSchema.mjs";

export const deleteCourses=async (req,res)=>{
  const instructorId=req.user.userId;
  const courseId=req.params.courseId;
  if(!courseId){
    return res.status(400).json({
      success:false,
      message:"Please provide the courseId"
    })
  }
  const course=await Course.findOne({_id:courseId})
  if(!course){
    return res.status(400).json({
      success:false,
      message:"The required course wasnt found"
    })
  }
  if(course.ownerId.toString() !==instructorId){
    return res.status(400).json({
      success:false,
      message:"You cannt delete other person's course sir :("
    })
  }
  await course.deleteOne()
  return res.status(200).json({
    success:true,
    message:"The course was deleted sucessfully"
  })
}