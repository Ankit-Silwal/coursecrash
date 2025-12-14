import Auth from "../auth.schema.mjs";
import { sendForgotPasswordMail } from "../auth.email/sendForgotOtp.mjs";
import { createAndStoreForgotOtp } from "../auth.email/Otp.mjs";
export const forgotpassword=async (req,res)=>{
  const {email}=req.body;
  if(!email){
    res.status(400).json({
      success:false,
      message:"Please enter the required email"
    })
  }
  const user=await Auth.findOne({email})
  if(!user){
    return res.status(400).json({
      success:false,
      message:"The required user wasnt found"
    })
  }
  const OTP=await createAndStoreForgotOtp(user._id)
  await sendForgotPasswordMail({to:email,otp:OTP})
  return res.status(200).json({
    success:true,
    message:"The forgot password mail was sent"
  })
}
