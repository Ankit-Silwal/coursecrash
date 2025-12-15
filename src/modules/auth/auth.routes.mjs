import { Router } from "express";
import { register } from "./auth.controller/register.mjs";
import { verifyotp } from "./auth.controller/verifyotp.mjs";
import { resendotp } from "./auth.controller/resendotp.mjs";
import { verifyresendotp } from "./auth.controller/verifyresendotp.mjs";
import { forgotpassword } from "./auth.controller/forgotpassword.mjs";
import { verifyforgotpassword } from "./auth.controller/verfyforgotpassword.mjs";
import { changeforgotpassword } from "./auth.controller/changeforgotpassword.mjs";
import { login } from "./auth.controller/login.mjs";
import { checklogin } from "../../middlewares/requireAuth.mjs";
import { changePassword } from "./auth.controller/changePassword.mjs";
import { logoutUser, logoutAllDevices } from "./auth.controller/logout.mjs";

const router=Router()


router.post('/login',login)
router.post('/register',register)

router.post('/verify-otp',verifyotp)
router.post('/resend-otp',resendotp)
router.post('/verify-resend-otp',verifyresendotp)

router.post('/forgot-password',forgotpassword)
router.post('/verify-forgot-password',verifyforgotpassword)
router.post('/change-forgot-password',changeforgotpassword)

router.post('/change-password',checklogin,changePassword)
router.post('/logout',checklogin,logoutUser)
router.post('/logout-all-devices',checklogin,logoutAllDevices)

export default router;
