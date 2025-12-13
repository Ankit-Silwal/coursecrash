import Auth from "../../schemas/authschemas.mjs";
import { createAndStoreResendOtp } from "../email/Otp.mjs"
import { transporter } from "../../utils/email/nodeMailer.mjs";

export const resendotp=async (req,res)=>{
  const {email}=req.body;
  if(!email){
    return res.status(400).json({
      success:false,
      message:"Please pass the email"
    })
  }
  const user=await Auth.findOne({email})
  if(!user){
    return res.status(400).json({
      success:false,
      message:"The user doesnt exists please register first"
    })
  }
  const OTP=await createAndStoreResendOtp(userId)
  
}