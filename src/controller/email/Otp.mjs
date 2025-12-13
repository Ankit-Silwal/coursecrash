import { generateOtp } from "../../utils/email/createOtp.mjs";
import redisClient from "../../config/redis.mjs";

const OTP_EXPIRY=300;
export async function createandStoreOtp(userId){
  const OTP=generateOtp()
  const key=`verify:otp:${userId}`
  await redisClient.set(key.OTP,{Ex:OTP_EXPIRY})
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
  await redisClient.delete(key)
  return({
    success:true,
    message:"The otp was verified"
  })
}