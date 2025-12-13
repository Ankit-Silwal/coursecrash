import { configDotenv } from "dotenv";
import express from "express"
import connectDB from "./src/config/db.mjs";
import router from "./src/routes/auth/auth.mjs";
import { initRedis } from "./src/config/redis.mjs";

configDotenv()

const app=express()
connectDB();
initRedis()
const PORT=process.env.PORT;
app.use(express.json())
app.use('/api/auth',router);
app.get('/',(req,res)=>{
  res.status(200).json({
    msg:"The server is running correctly"
  })
})


app.listen(PORT,()=>{
  console.log(`The server started at the port no ${PORT}`)
})
