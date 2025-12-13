import Auth from "../../schemas/authschemas.mjs";
import { sendForgotPasswordMail } from "../../utils/email/sendForgotOtp.mjs";
import { createAndStoreForgotOtp } from "../email/Otp.mjs";
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