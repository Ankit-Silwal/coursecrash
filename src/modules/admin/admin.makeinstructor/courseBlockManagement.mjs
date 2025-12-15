import Course from "../../instructor/schemas/courseSchema.mjs";

export const blockCourse=async (req,res)=>{
  try {
    const { courseId }=req.params;

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

    if(course.status==="blocked"){
      return res.status(400).json({
        success:false,
        message:"Course is already blocked"
      });
    }

    course.status="blocked";
    await course.save();

    return res.status(200).json({
      success:true,
      message:"Course blocked successfully",
      data:{
        courseId:course._id,
        title:course.title,
        status:course.status
      }
    });
  } catch(error){
    return res.status(500).json({
      success:false,
      message:"Error blocking course",
      error:error.message
    });
  }
}

export const unblockCourse=async (req,res)=>{
  try {
    const { courseId }=req.params;

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

    if(course.status!=="blocked"){
      return res.status(400).json({
        success:false,
        message:"Course is not blocked"
      });
    }

    course.status="published";
    await course.save();

    return res.status(200).json({
      success:true,
      message:"Course unblocked successfully",
      data:{
        courseId:course._id,
        title:course.title,
        status:course.status
      }
    });
  } catch(error){
    return res.status(500).json({
      success:false,
      message:"Error unblocking course",
      error:error.message
    });
  }
}
