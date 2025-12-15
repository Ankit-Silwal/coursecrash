import Course from "../schemas/courseSchema.mjs";

export const publishCourse=async (req,res)=>{
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
        message:"You can only publish your own courses"
      });
    }

    if(course.status==="published"){
      return res.status(400).json({
        success:false,
        message:"Course is already published"
      });
    }

    course.status="published";
    await course.save();

    return res.status(200).json({
      success:true,
      message:"Course published successfully",
      data:{
        courseId:course._id,
        title:course.title,
        status:course.status
      }
    });
  } catch(error){
    return res.status(500).json({
      success:false,
      message:"Error publishing course",
      error:error.message
    });
  }
}

export const unpublishCourse=async (req,res)=>{
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
        message:"You can only unpublish your own courses"
      });
    }

    if(course.status==="draft"){
      return res.status(400).json({
        success:false,
        message:"Course is already in draft status"
      });
    }

    course.status="draft";
    await course.save();

    return res.status(200).json({
      success:true,
      message:"Course unpublished successfully",
      data:{
        courseId:course._id,
        title:course.title,
        status:course.status
      }
    });
  } catch(error){
    return res.status(500).json({
      success:false,
      message:"Error unpublishing course",
      error:error.message
    });
  }
}
