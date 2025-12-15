import redisClient from "../config/redis.mjs";
import Auth from '../modules/auth/auth.schema.mjs'

export const checkAdmin=async (req,res,next)=>{
  const sessionId=req.cookies.sessionId;
  const session=await redisClient.get(sessionId)
  const userId=session.userId;
  const user=await Auth.findOne({_id:userId})
  const email=user.email;
  if(email!==process.env.ADMIN_EMAIL){
    return res.status(400).json({
      success:false,
      message:"Only admin are authorized for this task"
    })
  }
  next();
}

