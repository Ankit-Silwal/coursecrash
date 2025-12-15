import { deleteSession, deleteAllUsersSession } from "../auth.session.mjs";

export const logoutUser=async (req,res)=>{
  try {
    const sessionId=req.cookies.sessionId;
    
    if(!sessionId){
      return res.status(400).json({
        success:false,
        message:"No session found"
      });
    }
    const result=await deleteSession(sessionId);
    if(!result){
      return res.status(400).json({
        success:false,
        message:"Failed to logout"
      });
    }
    res.clearCookie('sessionId');
    return res.status(200).json({
      success:true,
      message:"Logged out successfully"
    });
  } catch(error){
    return res.status(500).json({
      success:false,
      message:"Error during logout",
      error:error.message
    });
  }
}

export const logoutAllDevices=async (req,res)=>{
  try {
    const userId=req.user.userId;
    const sessionId=req.cookies.sessionId;

    if(!userId){
      return res.status(400).json({
        success:false,
        message:"User not found"
      });
    }

    const deletedCount=await deleteAllUsersSession(userId);

    res.clearCookie('sessionId');

    return res.status(200).json({
      success:true,
      message:`Logged out from all ${deletedCount} devices successfully`,
      data:{
        devicesLoggedOut:deletedCount
      }
    });
  } catch(error){
    return res.status(500).json({
      success:false,
      message:"Error during logout",
      error:error.message
    });
  }
}
