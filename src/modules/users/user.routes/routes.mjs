import { applyInstructor } from "../../instructor/applyForm.mjs";
import { checklogin } from "../../../middlewares/requireAuth.mjs";
import { Router } from "express";
import { enrollmentReq } from "../enrollmentReq.mjs";
import { getAllCourses } from "../controller/getAllCourses.mjs";
const router=Router();

router.post('/apply-instructor',checklogin,applyInstructor)
router.post('/apply/:courseId/enroll',checklogin,enrollmentReq)
router.get('/courses',checklogin,getAllCourses)

export default router;
