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

const router=Router()

router.post('/login',login)
router.post('/register',register)
router.post('/verifyotp',verifyotp)
router.post('/resendotp',resendotp)
router.post('/verifyresendotp',verifyresendotp)
router.post('/forgotpassword',forgotpassword)
router.post('/verifyforgotpassword',verifyforgotpassword)
router.post('/changeforgotpassword',changeforgotpassword)

router.post('/changepassword',checklogin,changePassword)

export default router;
