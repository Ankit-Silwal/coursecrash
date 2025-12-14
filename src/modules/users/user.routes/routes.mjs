import { applyInstructor } from "../../instructor/applyForm.mjs";
import { checklogin } from "../../../middlewares/requireAuth.mjs";
import { Router } from "express";
const router=Router();

router.post('/applyinstructor',checklogin,applyInstructor)

export default router;