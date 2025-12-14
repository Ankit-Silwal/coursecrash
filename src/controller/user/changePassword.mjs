import Auth from "../../schemas/authschemas.mjs";
import bcrypt from "bcrypt";
import { checkpassword } from "../../utils/checkPassword.mjs";

export const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword, conformNewPassword } = req.body;
  if (!email || !oldpassword || !newPassword || !conformNewPassword) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide all the detials email,oldPassword,newPassword and conformNewPassword ",
    });
  }
  const user = await Auth.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "This user doesnt exist please register",
    });
  }
  let isSame = await bcrypt.compare(oldPassword, user.password);
  if (!isSame) {
    return res.status(400).json({
      success: false,
      message: "The old password didnt match",
    });
  }
  if (newPassword !== conformNewPassword) {
    return res.status(400).json({
      success: false,
      message: "Please correct the newPassword",
    });
  }
  isSame = await bcrypt.compare(user.password, newPassword);
  if (isSame) {
    return res.status(400).json({
      success: false,
      message: "You cannt put the same password sir :(",
    });
  }
  const checkedPassword = checkpassword(password);
  if (!checkedPassword.isStrong) {
    return res.status(400).json({
      success: false,
      message: "Password is not strong enough",
      errors: checkedPassword.errors,
    });
  }
  user.password=newPassword;
  await user.save();
  return res.status(400).json({
    success:false,
    message:"The Password was updated"
  })
};
