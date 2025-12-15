import InsReq from "../../instructor/instructor.request.mjs";
export const getAllRequest=async (req,res)=>{
  const applications = await InsReq
  .find({}, { userId: 1, _id: 0 })
  .populate("userId", "username");

  return res.status(200).json({
    success:true,
    message:"The list of username and userId is received",
    data:{
      applications
    }
  })

}