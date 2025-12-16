import redisClient from "../../../config/redis.mjs";
import Auth from "../../auth/auth.schema.mjs";
import Enrollment from "../../users/schema/user.enrolmentSchema.mjs";
import Course from "../schemas/courseSchema.mjs";
export const getAllEnrollmentReq = async (req, res) => {
  const sessionId = req.cookies.session;
  const session = await redisClient.get(sessionId);
  const parsedsession = JSON.parse(session);
  const instructorId = parsedsession.userId;
  const user = await Auth.findOne({ _id: instructorId });

  let enrollments;
  if (user.role === "admin") {
    enrollments = await Enrollment.find({}, { courseId: 1, userId: 1 });
  } else {
    const courses = await Course.find({ ownerId: instructorId }, { _id: 1 });
    const courseIds = courses.map(course => course._id.toString());
    enrollments = await Enrollment.find({ courseId: { $in: courseIds } }, { userId: 1, courseId: 1, status: 1 });
  }
  return res.status(200).json({
    success: true,
    message: "All the required requests are",
    data: enrollments,
  });
};

export const getSpecificEnrollmentReq=async (req,res)=>{
  const {enrollmentId}=req.params;
  const sessionId = req.cookies.session;
  const session = await redisClient.get(sessionId);
  const parsedsession = JSON.parse(session);
  const instructorId = parsedsession.userId;
  
  const enrollment=await Enrollment.findOne({_id: enrollmentId})
  if(!enrollment){
    return res.status(404).json({
      success: false,
      message: "Enrollment request not found"
    })
  }

  const course = await Course.findOne({ _id: enrollment.courseId, ownerId: instructorId })
  if(!course){
    return res.status(403).json({
      success: false,
      message: "You are not authorized to view this enrollment"
    })
  }
  
  return res.status(200).json({
    success: true,
    message: "Enrollment request retrieved successfully",
    data: enrollment
  })
}

export const acceptSpecificEnrollmentReq=async (req,res)=>{
  const {enrollmentId}=req.params;
  const sessionId = req.cookies.session;
  const session = await redisClient.get(sessionId);
  const parsedsession = JSON.parse(session);
  const instructorId = parsedsession.userId;
  
  const enrollment=await Enrollment.findOne({_id: enrollmentId})
  if(!enrollment){
    return res.status(404).json({
      success: false,
      message: "Enrollment request not found"
    })
  }

  const course = await Course.findOne({ _id: enrollment.courseId, ownerId: instructorId })
  if(!course){
    return res.status(403).json({
      success: false,
      message: "You are not authorized to accept this enrollment"
    })
  }

  enrollment.status = "approved"
  await enrollment.save()
  
  return res.status(200).json({
    success: true,
    message: "Enrollment request accepted successfully",
    data: enrollment
  })
}

export const rejectSpecificEnrollmentReq=async (req,res)=>{
  const {enrollmentId}=req.params;
  const sessionId = req.cookies.session;
  const session = await redisClient.get(sessionId);
  const parsedsession = JSON.parse(session);
  const instructorId = parsedsession.userId;
  
  const enrollment=await Enrollment.findOne({_id: enrollmentId})
  if(!enrollment){
    return res.status(404).json({
      success: false,
      message: "Enrollment request not found"
    })
  }

  const course = await Course.findOne({ _id: enrollment.courseId, ownerId: instructorId })
  if(!course){
    return res.status(403).json({
      success: false,
      message: "You are not authorized to reject this enrollment"
    })
  }

  enrollment.status = "blocked"
  await enrollment.save()
  
  return res.status(200).json({
    success: true,
    message: "Enrollment request rejected successfully",
    data: enrollment
  })
}

export const acceptAllEnrollmentReq=async (req,res)=>{
  const sessionId = req.cookies.session;
  const session = await redisClient.get(sessionId);
  const parsedsession = JSON.parse(session);
  const instructorId = parsedsession.userId;
  
  const courses = await Course.find({ ownerId: instructorId }, { _id: 1 });
  const courseIds = courses.map(course => course._id.toString());
  
  const result = await Enrollment.updateMany(
    { courseId: { $in: courseIds }, status: "pending" },
    { status: "approved" }
  )
  
  return res.status(200).json({
    success: true,
    message: "All enrollment requests accepted successfully",
    data: result
  })
}

export const rejectAllEnrollmentReq=async (req,res)=>{
  const sessionId = req.cookies.session;
  const session = await redisClient.get(sessionId);
  const parsedsession = JSON.parse(session);
  const instructorId = parsedsession.userId;
  
  const courses = await Course.find({ ownerId: instructorId }, { _id: 1 });
  const courseIds = courses.map(course => course._id.toString());
  
  const result = await Enrollment.updateMany(
    { courseId: { $in: courseIds }, status: "pending" },
    { status: "blocked" }
  )
  
  return res.status(200).json({
    success: true,
    message: "All enrollment requests rejected successfully",
    data: result
  })
}