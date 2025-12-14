import redisClient from "../config/redis.mjs";

export const checklogin=async (req,res,next)=>{
  const sessionId=req.cookies.sessionId;
  if(!sessionId){
    return res.status(400).json({
      success:false,
      message:"Not autheticated please login first"
    })
  }
  const session=await redisClient.get(sessionId);
  if(!session){
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid. Please login again."
    });
  }
  req.user={
    userId:session.userId
  }
  next();
}