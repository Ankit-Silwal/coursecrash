import mongoose from "mongoose";
const instructorRequest=new mongoose.Schema({
  userId:{
    type:String,
    required:true
  },
  status:{
    type:String,
    default:"Pending"
  },
  reviewedBy:{
    type:String,
    default:null
  },
  reviewedAt:{
    type:Date,
    default:null
  }
}, {timestamps:true})

const InsReq=mongoose.model("InstructorRequest",instructorRequest);
export default InsReq;
