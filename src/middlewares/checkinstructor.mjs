import redisClient from "../config/redis.mjs";
import Auth from '../modules/auth/auth.schema.mjs'

export const checkInstructor=async (req,res,next)=>{
  const sessionId=req.cookies.sessionId;
  const session=await redisClient.get(`session:${sessionId}`)
  if(!session){
    return res.status(401).json({
      success:false,
      message:"Session not found. Please login first"
    })
  }
  const parsedSession=JSON.parse(session);
  const userId=parsedSession.userId;
  const user=await Auth.findOne({_id:userId})
  if(!user){
    return res.status(401).json({
      success:false,
      message:"User not found"
    })
  }
  if(user.role!=='instructor'){
    return res.status(403).json({
      success:false,
      message:"Only instructors are authorized for this task"
    })
  }
  req.user={
    userId:userId,
    role:user.role
  }
  next();
}
