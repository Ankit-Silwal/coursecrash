import auth from "../../schemas/authschemas.mjs";
import { checkpassword } from "../../utils/checkPassword.mjs";

export const register=async (req,res)=>{
  const {username,email,password}=req.body;
  if(!username || !email || !password){
    return res.status(400).json({
      success:false,
      message:"Please provide all the required credentials username,email and password"
    })
  }

  const user=await auth.findOne({email})
  if(user){
    return res.status(400).json({
      success:false,
      message:"This email already exists please login or get verified"
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
    return res.status(200).json({
      success: true,
      message: "The user is register please verify the email"
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "An error occurred",
      error: err.message || err.toString()
    });
  }
}