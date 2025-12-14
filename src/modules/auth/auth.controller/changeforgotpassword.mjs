import redisClient from "../../../config/redis.mjs";
import Auth from "../auth.schema.mjs";
import bcrypt from "bcrypt";
import { checkpassword } from "../../../utils/password.mjs";
export const changeforgotpassword=async (req,res)=>{
  const {email,password}=req.body;
  if(!email || !password){
    return res.status(400).json({
      success:false,
      message:"Please provide email and new password"
    })
  }
  const user=await Auth.findOne({email})
  if(!user){
    return res.status(400).json({
      success:false,
      message:"This user doesnt exists"
    })
  }
  const userId=user._id;
  const isSamePassword=await bcrypt.compare(
    password,
    user.password
  )
  if(isSamePassword){
    return res.status(400).json({
      success:false,
      message:"You cannt put the same password sorry :( "
    })
  }
  const key=`access:password:${userId}`
  const value=await redisClient.get(key);
  if(value!=="True"){
    return res.status(400).json({
      success:false,
      message:"Please verify your email first"
    })
  }
  const checkedPassword=checkpassword(password);
  if(!checkedPassword.isStrong){
    return res.status(400).json({
      success:false,
      message:"Password is not strong enough",
      errors:checkedPassword.errors
    })
  }
  user.password=password;
  
  await user.save();
  await redisClient.del(key);
  return res.status(200).json({
    success:true,
    message:"The password was updated successfully"
  })
}
