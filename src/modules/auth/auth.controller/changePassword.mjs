import Auth from "../auth.schema.mjs";
import bcrypt from "bcrypt";
import { checkpassword } from "../../../utils/password.mjs";

export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found in session",
      });
    }

    const { oldPassword, newPassword, conformNewPassword } = req.body;
    if (!oldPassword || !newPassword || !conformNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide oldPassword, newPassword and conformNewPassword",
      });
    }

    const user = await Auth.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    let isSame = await bcrypt.compare(oldPassword, user.password);
    if (!isSame) {
      return res.status(400).json({
        success: false,
        message: "The current password didn't match",
      });
    }

    if (newPassword !== conformNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirmation don't match",
      });
    }

    isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as old password",
      });
    }

    const checkedPassword = checkpassword(newPassword);
    if (!checkedPassword.isStrong) {
      return res.status(400).json({
        success: false,
        message: "Password is not strong enough",
        errors: checkedPassword.errors,
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating password",
      error: error.message,
    });
  }
};
