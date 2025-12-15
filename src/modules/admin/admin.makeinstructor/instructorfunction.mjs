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
  const username=req.params.username;
  if(!username){
    return res.status(400).json({
      success:false,
      message:"Please pass the required username"
    })
  }
  const user=await Auth.findOne({username})
  if(!user){
    return res.status(400).json({
      success:false,
      message:"The required user isnt even registered sir"
    })
  }
  const userReq=await InsReq.findOne({username})
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
    message:`${username} was granted to be instructor`
  })
}