import redisClient from "../config/redis.mjs";
import Auth from "../modules/auth/auth.schema.mjs";
import Course from "../modules/instructor/schemas/courseSchema.mjs";
import Enrollment from "../modules/users/schema/user.enrolmentSchema.mjs";

export const courseAccess = async (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  const courseId = req.params?.courseId ?? req.body?.courseId;
  if (!courseId) {
    return res.status(400).json({
      success: false,
      message: "courseId is required",
    });
  }
  const course=await Course.findOne({_id:courseId})
  const ownerId=course.ownerId;
  const session = await redisClient.get(`session:${sessionId}`);
  const parsedSession = JSON.parse(session);
  const userId = parsedSession.userId;
  const user=await Auth.findOne({_id:userId})
  if(user.role==="admin"){
    return next();
  }
  if(user.role==="instructor" && userId==ownerId){
    return next()
  }
  const enroll=await Enrollment.findOne({courseId,userId})
  console.log(enroll)
  if(!enroll){
    return res.status(400).json({
      success:false,
      message:"please send the request to access this course"
    })
  }
  if(enroll.status!=="approved"){
    return res.status(400).json({
      success:false,
      message:"You still havent been enrolled"
    })
  }
  return next();
};

