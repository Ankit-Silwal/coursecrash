import Course from "../schemas/courseSchema.mjs"

export const getCourses=async (req,res)=>{
  const {userId}=req.user
  if(!userId){
    return res.status(400).json({
      success:false,
      message:"The session expired"
    })
  }
  const courses=await Course.find({ownerId:userId}
    ,{title:1}
  )
  return res.status(200).json({
    success:true,
    message:"These are the required courses available",
    data:{
      courses
    }
  })
}