import { createClient } from "redis";
const REDIS_URL=process.env.REDIS_URL
const redisClient=createClient({
  url:REDIS_URL
})
redisClient.on("error",(err)=>{
  console.log("Error on connecting with redis server",err);
})
redisClient.on("ready",()=>{
  console.log("The redis server has finally started");
})
export async function initRedis(){
  if(!redisClient.isOpen){
    await redisClient.connect();
  }
}
export default redisClient;