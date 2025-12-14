import { randomBytes } from "node:crypto";
import redisClient from "../../config/redis.mjs";

function generateSessionId(){
  return randomBytes(32).toString('hex');
}

const SESSION_TTL=24*60*60;

export async function extendSession(sessionId){
  if(!sessionId){
    return false;
  }
  const session=await redisClient.get(`session:${sessionId}`)
  if(!session){
    return false
  }
  const now=Date.now();
  const expiresAt=new Date(session.expiresAt).getTime()
  const timeUntilExpiry=expiresAt-now;
  const oneHour=60*60*1000;
  if(timeUntilExpiry>oneHour*24){
    return false;
  }
  const newExpiresAt=new Date(now+SESSION_TTL*1000).toISOString()
  session.expiresAt=newExpiresAt
  const sessionKey=`session:${sessionId}`
  await redisClient.set(sessionKey, JSON.stringify(session), { EX: SESSION_TTL });
  console.log(`Session been extended for user ${session.userId}`);
  return true;
}

export async function createSession(userId,req){
  const sessionId=generateSessionId()
  const sessionData={
    userId:userId.toString(),
    createdAt:new Date().toISOString(),
    expiresAt:new Date(Date.now()+SESSION_TTL*1000).toISOString(),
    ip:req.ip || 'unknown',
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

export async function getSession(sessionId){
  if(!sessionId){
    return null;
  }
  const sessionKey=`session:${sessionId}`
  const sessionData=await redisClient.get(sessionKey)
  if(!sessionData){
    return null;
  }
  return JSON.parse(sessionData);
}

export async function deleteSession(sessionId){
  if(!sessionId){
    return false;
  }
  const session=await getSession(sessionId)
  if(session){
    const userSessionKey=`user:sessions:${session.userId}`
    await redisClient.sRem(userSessionKey,sessionId)
  }
  const sessionKey=`session:${sessionId}`
  const result=await redisClient.del(sessionKey)
  if(result>0){
    console.log(`The session has been removed ${sessionId}`)
    return true;
  }
  return false;
}

export async function deleteAllUsersSession(userId){
  const userSessionKey=`user:sessions:${userId}`
  const sessionIds=await redisClient.sMembers(userSessionKey)

  if(!sessionIds || sessionIds.length===0){
    return 0;
  }
  let deletedCount=0;
  for(const sessionId of sessionIds){
    const sessionKey=`session:${sessionId}`
    const result=await redisClient.del(sessionKey);
    if(result>0){
      deletedCount++;
    }
  }
  await redisClient.del(userSessionKey);
  console.log(`Deleted ${deletedCount} users`)
  return deletedCount;
}

export async function getUserSession(userId){
  if(!userId){
    return [];
  }
  const userSessionKey=`user:sessions:${userId}`
  const sessionIds=await redisClient.sMembers(userSessionKey);
  if(!sessionIds || sessionIds.length===0){
    return [];
  }
  const rawSessions=await Promise.all(
    sessionIds.map((id)=>
    redisClient.get(`session:${id}`))
  )
  const results=[]
  for(let i=0;i<sessionIds.length;i++){
    const raw=rawSessions[i];
    if(!raw){
      await redisClient.sRem(userSessionKey,sessionIds[i]);
      continue;
    }
    const parsed=JSON.parse(raw);
    results.push({
      sessionId: sessionIds[i],
      userId: parsed.userId,
      ip: parsed.ip,
      userAgent: parsed.userAgent,
      createdAt: parsed.createdAt,
      expiresAt: parsed.expiresAt
    });
    return results;
  }

}
