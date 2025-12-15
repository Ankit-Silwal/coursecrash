import mongoose from "mongoose";
const courseSchema=mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:false
  },
  ownerId:{
    type:String,
    required:true
  },
  status:{
    type:String,
    enums:["published","draft","blocked"],
    default:"draft"
  },
},{timestamps:true})

const Course=mongoose.model("Courses",courseSchema)
export default Course;