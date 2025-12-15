import Lesson from "../../instructor/schemas/lessonSchema.mjs";
import Course from "../../instructor/schemas/courseSchema.mjs";

export const getLessonsByCoursePublic=async (req,res)=>{
  try {
    const { courseId }=req.params;

    if(!courseId){
      return res.status(400).json({
        success:false,
        message:"Please provide courseId"
      });
    }

    const course=await Course.findOne({_id:courseId,status:"published"});
    if(!course){
      return res.status(404).json({
        success:false,
        message:"Course not found or not published"
      });
    }

    const lessons=await Lesson.find({courseId}).sort({order:1});

    return res.status(200).json({
      success:true,
      message:"Lessons retrieved successfully",
      data:{
        lessons,
        count:lessons.length
      }
    });
  } catch(error){
    return res.status(500).json({
      success:false,
      message:"Error retrieving lessons",
      error:error.message
    });
  }
}

export const getLessonById=async (req,res)=>{
  try {
    const { lessonId }=req.params;

    if(!lessonId){
      return res.status(400).json({
        success:false,
        message:"Please provide lessonId"
      });
    }

    const lesson=await Lesson.findOne({_id:lessonId});
    if(!lesson){
      return res.status(404).json({
        success:false,
        message:"Lesson not found"
      });
    }

    const course=await Course.findOne({_id:lesson.courseId,status:"published"});
    if(!course){
      return res.status(404).json({
        success:false,
        message:"Course not found or not published"
      });
    }

    return res.status(200).json({
      success:true,
      message:"Lesson retrieved successfully",
      data:{
        lesson
      }
    });
  } catch(error){
    return res.status(500).json({
      success:false,
      message:"Error retrieving lesson",
      error:error.message
    });
  }
}
