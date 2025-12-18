import auth from "../auth.schema.mjs";
import { checkpassword } from "../../../utils/password.mjs";
import { createandStoreOtp } from "../auth.email/Otp.mjs";
import { sendMail } from "../auth.email/sendOtpEmail.mjs";

export const register=async (req,res)=>{
  const {username,email,password,confirmPassword}=req.body;
  if(!username || !email || !password || !confirmPassword){
    return res.status(400).json({
      success:false,
      message:"Please provide all required fields: username, email, password, confirmPassword"
    })
  }

  const user=await auth.findOne({email})
  if(user){
    return res.status(400).json({
      success:false,
      message:"This email already exists please login or get verified"
    })
  }

  if(password!==confirmPassword){
    return res.status(400).json({
      success:false,
      message:"Password and confirmPassword do not match"
    })
  }

  const checkedPassword=checkpassword(password)
  if(!checkedPassword.isStrong){
    return res.json({
      success:false,
      errors:checkedPassword.errors
    })
  }
  
  try {
    const newUser = new auth({
      username,
      email,
      password
    });
    await newUser.save();
    const userId=newUser._id;
    const OTP=await createandStoreOtp(userId);
    await sendMail({to:email,otp:OTP})
    return res.status(200).json({
      success: true,
      message: "The user is registered please verify the email"
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "An error occurred",
      error: err.message || err.toString()
    });
  }
}
