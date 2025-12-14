import { Router } from "express";
import { register } from "../../controller/user/register.mjs";
import { verifyotp } from "../../controller/user/verifyotp.mjs";
import { resendotp } from "../../controller/user/resendotp.mjs";
import { verifyresendotp } from "../../controller/user/verifyresendotp.mjs";
import { forgotpassword } from "../../controller/user/forgotpassword.mjs";
import { verifyforgotpassword } from "../../controller/user/verfyforgotpassword.mjs";
import { changeforgotpassword } from "../../controller/user/changeforgotpassword.mjs";
import { login } from "../../controller/user/login.mjs";

const router=Router()

router.post('/register',register)
router.post('/verifyotp',verifyotp)
router.post('/resendotp',resendotp)
router.post('/verifyresendotp',verifyresendotp)
router.post('/forgotpassword',forgotpassword)
router.post('/verifyforgotpassword',verifyforgotpassword)
router.post('/changeforgotpassword',changeforgotpassword)
router.post('/login',login)
export default router;