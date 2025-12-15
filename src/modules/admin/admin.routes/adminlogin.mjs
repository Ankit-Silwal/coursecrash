import Auth from "../../auth/auth.schema.mjs";
import bcrypt from "bcrypt"
import { createSession } from "../../auth/auth.session.mjs";
export const loginAdmin=async (req,res)=>{
  const {email,password}=req.body;
  if(!email || !password){
    res.json({
      success:false,
      message:"Please provide both the email and the password"
    })
  }
  const user=await Auth.findOne({email})
  if (user.role!=="admin"){
    user.role="admin";
    await user.save()
  }
  
  if(!user){
    return res.status(400).json({
      success:false,
      message:"The user with this email doesn't exist"
    })
  }
  const comparasion=await bcrypt.compare(
    password,
    user.password
  )
  if(!comparasion){
    return res.status(400).json({
      success:false,
      message:"The password is incorrect"
    })
  }
  const sessonId=await createSession(user._id,req)
  res.cookie('sessionId',sessonId,{
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    samesite:"strict",
    maxAge:24*60*60*1000
  })
  return res.status(200).json({
    success:true,
    message:"You are logged in as admin sir full power bitchh!",
    User:{
      username:user.username,
      email:user.email,
    }
  })
}
