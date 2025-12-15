import InsReq from "../../instructor/instructor.request.mjs";
import redisClient from "../../../config/redis.mjs";
import Auth from "../../auth/auth.schema.mjs";


export const getAllRequest=async (req,res)=>{
  const applications = await InsReq
  .find({}, { userId: 1,username:1, _id: 0 })
  .populate("userId", "username");

  return res.status(200).json({
    success:true,
    message:"The list of username and userId is received",
    data:{
      applications
    }
  })
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
  if(userReq.status==="fulfilled"){
    return res.status(400).json({
      success:false,
      message:"He is already an instructor"
    })
  }
  userReq.status="fulfilled"
  await userReq.save()
  return res.status(200).json({
    success:true,
    message:`Instructor was granted`
  })
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
  const instructors=await InsReq.find({status:"fulfilled"})
  return res.status(200).json({
    success:true,
    message:"All instructors retrieved successfully",
    data:{
      instructors,
      count:instructors.length
    }
  })
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

