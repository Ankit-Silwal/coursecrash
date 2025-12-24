import redisClient from "../../config/redis.mjs";
import Auth from "../auth/auth.schema.mjs"
import InsReq from "./schemas/instructor.request.mjs";

export const applyInstructor=async (req,res)=>{
  try {
    const sessionId = req.cookies?.sessionId || req.headers["x-session-id"] || req.query.sessionId;
    
    if(!sessionId){
      return res.status(401).json({
        success:false,
        message:"Unauthorized: no session found"
      })
    }

    const session = await redisClient.get(`session:${sessionId}`);
    if(!session){
      return res.status(401).json({
        success:false,
        message:"Session expired or invalid"
      })
    }

    const parsedSession = JSON.parse(session);
    const userId = parsedSession.userId;

    const user = await Auth.findById(userId);
    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found"
      })
    }

    if(user.role==="instructor"){
      return res.status(400).json({
        success:false,
        message:"You are already an Instructor"
      })
    }

    const existingRequest = await InsReq.findOne({userId});
    if(existingRequest){
      if(existingRequest.status === "Pending"){
        return res.status(409).json({
          success:false,
          message:"You already have a pending instructor application"
        })
      }
      if(existingRequest.status === "approved"){
        return res.status(400).json({
          success:false,
          message:"Your instructor application has already been approved. You are an instructor."
        })
      }
      if(existingRequest.status === "rejected"){
        return res.status(400).json({
          success:false,
          message:"Your previous instructor application was rejected. Please contact support."
        })
      }
    }

    const dateNow = new Date().toISOString();
    const newInstructor = new InsReq({
      userId,
      username:user.username,
      createdAt:dateNow
    });

    await newInstructor.save();

    return res.status(201).json({
      success:true,
      message:"Instructor application submitted successfully",
      request:{
        _id: newInstructor._id,
        userId,
        username:user.username,
        status:newInstructor.status,
        reviewedBy:newInstructor.reviewedBy,
        reviewedAt:newInstructor.reviewedAt,
        createdAt:newInstructor.createdAt
      }
    })
  } catch (error) {
    console.error("Apply instructor error:", error);
    return res.status(500).json({
      success:false,
      message:"Error submitting application",
      error: error.message
    })
  }
}
