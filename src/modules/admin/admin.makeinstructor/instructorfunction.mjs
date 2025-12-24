import InsReq from "../../instructor/schemas/instructor.request.mjs";
import redisClient from "../../../config/redis.mjs";
import Auth from "../../auth/auth.schema.mjs";
import mongoose from "mongoose";


export const getAllRequest=async (req,res)=>{
  try {
    const applications = await InsReq.find({status: "Pending"});
    
    if(!applications || applications.length === 0){
      return res.status(200).json({
        success:true,
        message:"No pending instructor applications",
        data:{
          applications: []
        }
      })
    }

    const enrichedApplications = applications.map(app => ({
      _id: app._id,
      userId: app.userId,
      username: app.username,
      name: app.username,
      status: app.status,
      createdAt: app.createdAt,
      reviewedBy: app.reviewedBy,
      reviewedAt: app.reviewedAt
    }));

    return res.status(200).json({
      success:true,
      message:"Pending instructor applications retrieved successfully",
      data:{
        applications: enrichedApplications,
        count: enrichedApplications.length
      }
    })
  } catch (error) {
    console.error("Get all requests error:", error);
    return res.status(500).json({
      success:false,
      message:"Error retrieving applications",
      error: error.message
    })
  }
}

export const grantAllRequest=async (req,res)=>{
  const adminsesId=req.cookies.sessionId;
  const adminses=await redisClient.get(`session:${adminsesId}`)
  
  if(!adminses){
    return res.status(401).json({
      success:false,
      message:"Session expired. Please login again"
    })
  }
  
  const parsedSession=JSON.parse(adminses)
  const userId=parsedSession.userId;
  const user=await Auth.findOne({_id:userId})
  const username=user.username
  let count=0;
  const applications=await InsReq.find();
  for(let application of applications){
    if(application.status!=="fulfilled"){
      count++
    }
    const now=new Date().toISOString()
    application.status="fulfilled";
    application.reviewedBy=username;
    application.reviewedAt=now;
    await application.save()
  }
  res.status(200).json({
    success:true,
    message:`${count} users were granted to be instructor`
  })
}

export const grantuser=async (req,res)=>{
  try {
    const instructorId=req.params.instructorId;
    if(!instructorId){
      return res.status(400).json({
        success:false,
        message:"Please pass the required instructorId"
      })
    }

    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(instructorId);
    } catch (error) {
      return res.status(400).json({
        success:false,
        message:"Invalid instructor ID format"
      })
    }

    const user=await Auth.findById(objectId)
    if(!user){
      return res.status(400).json({
        success:false,
        message:"The required user isnt even registered"
      })
    }

    const userReq=await InsReq.findOne({userId:instructorId})
    if(!userReq){
      return res.status(400).json({
        success:false,
        message:"The requested user hasnt asked for any access"
      })
    }

    if(userReq.status==="fulfilled"){
      return res.status(400).json({
        success:false,
        message:"They are already an instructor"
      })
    }

    userReq.status="fulfilled"
    await userReq.save()
    user.role="instructor"
    await user.save()

    return res.status(200).json({
      success:true,
      message:"Instructor was granted successfully"
    })
  } catch (error) {
    console.error("Grant user error:", error);
    return res.status(500).json({
      success:false,
      message:"Error granting instructor access",
      error: error.message
    })
  }
}

export const blockinstructor=async (req,res)=>{
  const instructorId=req.params.instructorId;
  if(!instructorId){
    return res.status(400).json({
      success:false,
      message:"Please pass the required instructorId"
    })
  }
  const user=await Auth.findOne({_id:instructorId})
  if(!user){
    return res.status(400).json({
      success:false,
      message:"The required user isnt even registered sir"
    })
  }
  const userReq=await InsReq.findOne({userId:instructorId})
  if(!userReq){
    return res.status(400).json({
      success:false,
      message:"The requested user hasnt asked for any access"
    })
  }
  if(userReq.status!=="fulfilled"){
    return res.status(400).json({
      success:false,
      message:"He isnt even a instructor"
    })
  }
  userReq.status="blocked"
  await userReq.save()
  return res.status(200).json({
    success:true,
    message:`Instructor was blocked`
  })
}

export const deleteuser=async (req,res)=>{
  const userId=req.params.userId;
  if(!userId){
    return res.status(400).json({
      success:false,
      message:"Please pass the required userId"
    })
  }
  const user=await Auth.findOne({_id:userId})
  if(!user){
    return res.status(400).json({
      success:false,
      message:"The required user isnt even registered sir"
    })
  }
  await Auth.deleteOne({_id:userId})
  await InsReq.deleteOne({userId:userId})
  return res.status(200).json({
    success:true,
    message:`User was deleted successfully`
  })
}

export const viewAllUsers=async (req,res)=>{
  const users=await Auth.find({},{password:0})
  return res.status(200).json({
    success:true,
    message:"All users retrieved successfully",
    data:{
      users,
      count:users.length
    }
  })
}

export const viewAllInstructors=async (req,res)=>{
  try{
    // Pull directly from Auth: users whose role is instructor
    const instructors = await Auth.find({ role: "instructor" }, { password: 0 }).lean();
    return res.status(200).json({
      success:true,
      message:"All instructors retrieved successfully",
      data:{
        instructors,
        count: instructors.length
      }
    })
  } catch (error){
    console.error("viewAllInstructors error:", error);
    return res.status(500).json({
      success:false,
      message:"Error retrieving instructors",
      error: error.message
    })
  }
}

export const viewAllBlockedInstructors=async (req,res)=>{
  const blockedInstructors=await InsReq.find({status:"blocked"})
  return res.status(200).json({
    success:true,
    message:"All blocked instructors retrieved successfully",
    data:{
      blockedInstructors,
      count:blockedInstructors.length
    }
  })
}

export const unblockinstructor=async (req,res)=>{
  const instructorId=req.params.instructorId;
  if(!instructorId){
    return res.status(400).json({
      success:false,
      message:"Please pass the required instructorId"
    })
  }
  const user=await Auth.findOne({_id:instructorId})
  if(!user){
    return res.status(400).json({
      success:false,
      message:"The required user isnt even registered sir"
    })
  }
  const userReq=await InsReq.findOne({userId:instructorId})
  if(!userReq){
    return res.status(400).json({
      success:false,
      message:"The requested user hasnt asked for any access"
    })
  }
  if(userReq.status!=="blocked"){
    return res.status(400).json({
      success:false,
      message:"He isnt even a blocked instructor"
    })
  }
  userReq.status="fulfilled"
  await userReq.save()
  return res.status(200).json({
    success:true,
    message:`Instructor was unblocked`
  })
}

