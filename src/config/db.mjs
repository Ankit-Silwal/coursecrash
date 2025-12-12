import mongoose from "mongoose";
const connectDB=async ()=>{
  try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log(`MongoDb was connected`)
  }catch(err){
    console.log("MongoDb connection failed",err);
  }
}

export default connectDB;