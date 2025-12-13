import { Router } from "express";
import { register } from "../../controller/user/register.mjs";
import { verifyotp } from "../../controller/user/verifyotp.mjs";
import { resendotp } from "../../controller/user/resendotp.mjs";
import { verifyresendotp } from "../../controller/user/verifyresendotp.mjs";
const router=Router()

router.post('/register',register)
router.post('/verifyotp',verifyotp)
router.post('/resendotp',resendotp)
router.post('/verifyresendotp',verifyresendotp)

export default router;