import redisClient from "../config/redis.mjs";
import Auth from '../modules/auth/auth.schema.mjs'
import { extendSession } from "../modules/auth/auth.session.mjs";

export const checkAdmin=async (req,res,next)=>{
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
  const email=user.email;
  if(email!==process.env.ADMIN_EMAIL){
    return res.status(400).json({
      success:false,
      message:"Only admin are authorized for this task"
    })
  }
  
  await extendSession(sessionId);
  
  next();
}

