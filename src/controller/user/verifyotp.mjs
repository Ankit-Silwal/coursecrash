import Auth from "../../schemas/authschemas.mjs";
import { verifyAndConsumeOtp } from "../email/Otp.mjs";

export const verifyotp = async (req, res, next) =>
{
  try
  {
    const { otp, email } = req.body;
    if (!otp || !email)
    {
      return res.status(400).json({
        success: false,
        message: "Please pass both the OTP and email"
      });
    }

    const user = await Auth.findOne({ email });

    if (!user)
    {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const response = await verifyAndConsumeOtp(user._id, otp);
    return res.status(response.success ? 200 : 400).json(response);
  }
  catch (error)
  {
    next(error);
  }
};


