import { generateOtp } from "../../utils/email/createOtp.mjs";
import redisClient from "../../config/redis.mjs";
import Auth from "../../schemas/authschemas.mjs";

const OTP_EXPIRY=300;
export async function createandStoreOtp(userId){
  const OTP=await generateOtp()
  const key=`verify:otp:${userId}`
  await redisClient.set(key,OTP,{EX:OTP_EXPIRY})
  return OTP;
}

export async function verifyAndConsumeOtp(userId,submittedOtp){
  const key=`verify:otp:${userId}`
  const stored=await redisClient.get(key)
  if(!stored){
    return({
      success:false,
      message:"Expired or missing Otp"
    })
  }
  if(stored!=String(submittedOtp)){
    return ({
      success:false,
      message:"The Otp didnt match please retry"
    })
  }
  await redisClient.del(key)
  const user=await Auth.findOne({_id:userId});
  if(!user){
    return({
      success:false,
      message:"The user does not exists"
    })
  }
  user.isVerified=true;
  return({
    success:true,
    message:"The otp was verified"
  })
}

export async function createAndStoreResendOtp(userId){
  const value=`verify:resendotp:{userId}`
  const stored=await redisClient.get(value);
  if(stored){
    redisClient.del(key)
  }
  const OTP=generateOtp();
  const key=`verify:resendotp:${userId}`
  await redisClient.set(key,OTP,{EX:OTP_EXPIRY})
  return OTP;
}

export async function verifyAndConsumeResendOtp(userId,submittedOtp){
  const user=await Auth.findOne({_id:userId})
  if(!user){
    return({
      success:false,
      message:"This user doesnt exist"
    })
  }
  if(user.isVerified){
    return({
      success:false,
      message:"The user is already verified"
    })
  }
  const key=`verify:resendotp:${userId}`;
  const value=await redisClient.get(key)
  if(!value){
    return({
      success:false,
      message:"The Otp has been expired"
    })
  }
  if(value !=submittedOtp){
    return({
      success:false,
      message:"Please enter the correct OTP"
    })
  }
  await redisClient.del(key);
  user.isVerified=true;
  return({
    success:true,
    message:"You are verified"
  })
}