import { randomBytes } from "crypto";
import redisClient from "../config/redis.mjs";

function generateSessionId(){
  return randomBytes(32).toString('hex');
}

const SESSION_TTL=24*60*60;
export async function createSession(userId,req){
  const sessionId=generateSessionId()
  const sessionData={
    userId:userId.toString(),
    createdAt:new Date.now().toISOString(),
    expiresAt:new Date(Date.now()+SESSION_TTL*1000).toISOString(),
    ip:req.ip || unknown,
    userAgent:req.get('userAgent')
  }
  const sessionKey=`session:${sessionId}`
  await redisClient.set(sessionKey,JSON.stringify(sessionData),{
    EX:SESSION_TTL
  })
  const userSessionKey=`user:sessions:${userId}`;
  await redisClient.sAdd(userSessionKey,sessionId);
  await redisClient.expire(userSessionKey,SESSION_TTL)
  console.log(`Session created for user ${userId}`)
  return sessionId;
}

