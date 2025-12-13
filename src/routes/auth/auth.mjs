import { Router } from "express";
import { register } from "../../controller/user/register.mjs";
import { verifyotp } from "../../controller/user/verifyotp.mjs";
const router=Router()

router.post('/register',register)
router.post('/verifyotp',verifyotp)

export default router;