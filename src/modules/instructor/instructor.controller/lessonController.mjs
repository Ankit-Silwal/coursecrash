import Lesson from "../schemas/lessonSchema.mjs";
import Course from "../schemas/courseSchema.mjs";

export const createLesson = async (req, res) =>
{
  try
  {
    const { courseId } = req.params;
    const instructorId = req.user.userId;
    const { title, type, order } = req.body;

    if (!courseId || !title || !type || order === undefined)
    {
      return res.status(400).json({
        success: false,
        message: "courseId, title, type, and order are required"
      });
    }

    if (!["VIDEO", "TEXT", "PDF"].includes(type))
    {
      return res.status(400).json({
        success: false,
        message: "Type must be VIDEO, TEXT, or PDF"
      });
    }

    const course = await Course.findById(courseId);

    if (!course)
    {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    if (course.ownerId.toString() !== instructorId)
    {
      return res.status(403).json({
        success: false,
        message: "You can only add lessons to your own courses"
      });
    }

    const lesson = await Lesson.create({
      courseId,
      title,
      type,
      order,
      contentUrl: null,
      textContent: null
    });

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      data: {
        lessonId: lesson._id,
        courseId: lesson.courseId,
        title: lesson.title,
        type: lesson.type,
        order: lesson.order
      }
    });
  }
  catch (err)
  {
    return res.status(500).json({
      success: false,
      message: "Failed to create lesson",
      error:err
    });
  }
};


export const getLessonsByCourse=async (req,res)=>{
  try {
    const { courseId }=req.params;
    const instructorId=req.user.userId;

    if(!courseId){
      return res.status(400).json({
        success:false,
        message:"Please provide courseId"
      });
    }

    const course=await Course.findOne({_id:courseId});
    if(!course){
      return res.status(404).json({
        success:false,
        message:"Course not found"
      });
    }

    if(course.ownerId.toString() !==instructorId){
      return res.status(403).json({
        success:false,
        message:"You can only view lessons from your own courses"
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

export const deleteLesson=async (req,res)=>{
  try {
    const { lessonId }=req.params;
    const instructorId=req.user.userId;

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

    const course=await Course.findOne({_id:lesson.courseId});
    if(!course){
      return res.status(404).json({
        success:false,
        message:"Course not found"
      });
    }

    if(course.ownerId.toString() !==instructorId){
      return res.status(403).json({
        success:false,
        message:"You can only delete lessons from your own courses"
      });
    }

    await Lesson.deleteOne({_id:lessonId});

    return res.status(200).json({
      success:true,
      message:"Lesson deleted successfully"
    });
  } catch(error){
    return res.status(500).json({
      success:false,
      message:"Error deleting lesson",
      error:error.message
    });
  }
}
