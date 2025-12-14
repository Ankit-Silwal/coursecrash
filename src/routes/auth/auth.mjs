import { Router } from "express";
import { register } from "../../controller/user/register.mjs";
import { verifyotp } from "../../controller/user/verifyotp.mjs";
import { resendotp } from "../../controller/user/resendotp.mjs";
import { verifyresendotp } from "../../controller/user/verifyresendotp.mjs";
import { forgotpassword } from "../../controller/user/forgotpassword.mjs";
import { verifyforgotpassword } from "../../controller/user/verfyforgotpassword.mjs";
import { changeforgotpassword } from "../../controller/user/changeforgotpassword.mjs";
import { login } from "../../controller/user/login.mjs";
import { checklogin } from "../../middleware/checkLogin.mjs";
import { changePassword } from "../../controller/user/changePassword.mjs";


const router=Router()


router.post('/login',login)
router.post('/register',register)
router.post('/verifyotp',verifyotp)
router.post('/resendotp',resendotp)
router.post('/verifyresendotp',verifyresendotp)

router.post('/forgotpassword',checklogin,forgotpassword)
router.post('/verifyforgotpassword',checklogin,verifyforgotpassword)
router.post('/changeforgotpassword',checklogin,changeforgotpassword)
router.post('/changepassword',checklogin,changePassword)

export default router;