import Auth from "../auth/auth.schema.mjs"
import InsReq from "./instructor.request.mjs";
export const applyInstructor=async (req,res)=>{
  const {email,password}=req.body;
  if(!email || !password){
    return res.status(400).json({
      success:false,
      message:"Please provide email and password for conformation"
    })
  }
  const user=await Auth.findOne({email})
  if(!user){
    return res.staus(400).json({
      success:false,
      message:"The User doesnt contain any user"
    })
  }
  if(user.role==="instructor"){
    return res.status(400).json({
      success:false,
      message:"You are already an Instructor"
    })
  }
  const userId=user._id;
  const dateNow=new Date().toISOString()
  const newInstructor=new InsReq({
    userId,
    username:user.username,
    createdAt:dateNow
  })
  await newInstructor.save()
  return res.status(200).json({
    success:true,
    message:"The request was sent",
    request:{
      userId,
      username:user.username,
      Status:newInstructor.status,
      reviewedBy:newInstructor.reviewedBy,
      reviewedAt:newInstructor.reviewedAt,
      createdAt:newInstructor.createdAt
    }
  })
}
