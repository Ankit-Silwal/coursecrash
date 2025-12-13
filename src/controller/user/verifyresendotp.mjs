import Auth from "../../schemas/authschemas.mjs";
import { verifyAndConsumeResendOtp } from "../email/Otp.mjs";
export const verifyresendotp=async (req,res)=>{
  const {email,otp}=req.body;
  const user=await Auth.findOne({email});
  const userId=user._id;
  if(!email || !otp){
    return res.status(400).json({
      success:false,
      message:"Please provide both the otp and the email"
    })
  }
  const response=await verifyAndConsumeResendOtp(userId,otp)
  return res.json({...response})
}