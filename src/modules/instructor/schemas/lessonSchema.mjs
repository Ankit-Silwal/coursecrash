import mongoose from "mongoose";
const lessonSchema=new mongoose.Schema({
  courseId:{
    type:String,
    required:true
  },
  title:{
    type:String,
    required:true
  },
  type:{
    type:String,
    enum:["VIDEO","TEXT","PDF"],
    required:true
  },
  contentUrl:{
    type:String
  },
  order:{
    type:Number
  }
},{timestamps:true})

const Lesson=mongoose.model("Lesson",lessonSchema);
export default Lesson;
