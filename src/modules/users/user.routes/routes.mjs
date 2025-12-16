import { applyInstructor } from "../../instructor/applyForm.mjs";
import { checklogin } from "../../../middlewares/requireAuth.mjs";
import { Router } from "express";
import { enrollmentReq } from "../enrollmentReq.mjs";
import { getAllCourses } from "../controller/getAllCourses.mjs";
import { getLessonsByCoursePublic, getLessonById } from "../controller/lessonsController.mjs";
import { getReadUrl } from "../../instructor/instructor.controller/supaBaseManagement.mjs";
import { courseAccess } from "../../../middlewares/checkCouseAccess.mjs";
const router=Router();

router.post('/apply-instructor',checklogin,applyInstructor)
router.post('/apply/:courseId/enroll',checklogin,enrollmentReq)
router.get('/courses',checklogin,getAllCourses)
router.get('/courses/:courseId/lessons',checklogin,courseAccess,getLessonsByCoursePublic)
router.get('/lessons/:lessonId',checklogin,courseAccess,getLessonById)
router.post('/lessons/getlink',checklogin,courseAccess,getReadUrl)

export default router;
