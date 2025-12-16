import Course from "../instructor/schemas/courseSchema.mjs";
import Enrollment from './schema/user.enrolmentSchema.mjs'

export const enrollmentReq=async (req,res)=>{
  const courseId=req.params.courseId;
  const userId=req.user.userId;
  if(!courseId){
    return res.status(400).json({
      success:false,
      message:"Please provide the course id"
    })
  }
  const course=await Course.findOne({_id:courseId})
  if(!course){
    return res.status(400).json({
      success:false,
      message:"The required course wasnt found"
    })
  }
  const existingEnrollment=await Enrollment.findOne({userId, courseId})
  if(existingEnrollment){
    return res.status(409).json({
      success:false,
      message:"You have already sent an enrollment request for this course"
    })
  }
  
  const form=await Enrollment.create({
    userId,
    courseId
  })
  return res.status(201).json({
    success:true,
    message:"Enrollment request submitted successfully",
    data:{
      form
    }
  })
}