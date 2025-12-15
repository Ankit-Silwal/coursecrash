import mongoose from "mongoose";
const enrollment=mongoose.Schema({
  userId:{
    type:String,
    required:true,
  },
  courseId:{
    type:String,
    required:true,
  },
  status:{
    type:String,
    enum:['pending','approved','blocked'],
    default:'pending'
  },
},{timestamps:true})

const Enrollment=mongoose.model("Enrollment",enrollment)
export default Enrollment;
