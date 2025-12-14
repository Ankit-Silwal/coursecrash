import { transporter } from "./nodeMailer.mjs";

export async function sendForgotPasswordMail({ to, otp })
{
  await transporter.sendMail({
    from: `"CourseCrash" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset Your Password – OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 32px;">
        <div style="max-width: 420px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); padding: 28px;">
          
          <h2 style="color: #e63946; text-align: center; margin-bottom: 12px;">
            Password Reset Request
          </h2>

          <p style="font-size: 15px; color: #333; text-align: center;">
            We received a request to reset your account password.
          </p>

          <p style="font-size: 15px; color: #333; text-align: center;">
            Use the OTP below to continue:
          </p>

          <div style="
            font-size: 34px;
            font-weight: bold;
            color: #111;
            background-color: #f1f7ff;
            border-radius: 8px;
            padding: 18px;
            text-align: center;
            letter-spacing: 6px;
            margin: 24px 0;
          ">
            ${otp}
          </div>

          <p style="font-size: 14px; color: #666; text-align: center;">
            This OTP will expire in <b>5 minutes</b>.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

          <p style="font-size: 13px; color: #888; text-align: center;">
            If you did <b>not</b> request a password reset, please ignore this email.
            Your account remains secure.
          </p>
        </div>
      </div>
    `
  });
}
