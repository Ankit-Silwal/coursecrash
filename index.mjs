import { configDotenv } from "dotenv";
import express from "express"
import connectDB from "./src/config/db.mjs";


configDotenv()

const app=express()
connectDB();
const PORT=process.env.PORT;
app.use(express.json())

app.get('/',(req,res)=>{
  res.status(200).json({
    msg:"The server is running correctly"
  })
})


app.listen(PORT,()=>{
  console.log(`The server started at the port no ${PORT}`)
})
