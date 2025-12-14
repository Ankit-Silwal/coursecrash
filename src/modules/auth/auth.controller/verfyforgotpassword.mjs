import Auth from "../auth.schema.mjs";
import { verifyAndConsumeForgotOtp } from "../auth.email/Otp.mjs";

export const verifyforgotpassword=async (req,res)=>{
  const {email,otp}=req.body;
  const user=await Auth.findOne({email})
  const userId=user._id;
  if(!email || !otp){
    return res.status(400).json({
      success:false,
      message:"Please provide both the email and the Otp"
    })
  }
  if(!user){
    return res.status(400).json({
      success:false,
      message:"The user doesnt exists"
    })
  }
  const response=await verifyAndConsumeForgotOtp(userId,otp)
  return res.json({...response})
}
