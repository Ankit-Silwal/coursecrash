import Auth from "../../schemas/authschemas.mjs";
import { createAndStoreResendOtp } from "../email/Otp.mjs";
import { sendMail } from "../../utils/email/sendOtpEmail.mjs";

export const resendotp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please pass the email",
    });
  }
  const user = await Auth.findOne({ email });
  const userId = user._id;
  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "User is already verified",
    });
  }

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "The user doesnt exists please register first",
    });
  }
  const OTP = await createAndStoreResendOtp(userId);
  await sendMail({ to: email, otp: OTP });
  return res.status(200).json({
    success: true,
    message: "The OTP is sent to the email",
  });
};
