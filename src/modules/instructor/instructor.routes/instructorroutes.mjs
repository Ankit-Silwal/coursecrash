import { Router } from "express";
import { postCourses } from "../instructor.controller/postcourses.mjs";
import { checkInstructor } from "../../../middlewares/checkinstructor.mjs";
import { getCourses } from "../instructor.controller/getcourses.mjs";
import { deleteCourses } from "../instructor.controller/deleteCourses.mjs";
import { approveEnrollment, revokeEnrollment } from "../instructor.controller/enrollmentManagement.mjs";

const router=Router()
router.post('/courses',checkInstructor,postCourses)
router.get('/courses',checkInstructor,getCourses)
router.delete('/courses/:courseId',checkInstructor,deleteCourses)
router.post('/enrollments/:enrollmentId/approve',checkInstructor,approveEnrollment)
router.post('/enrollments/:enrollmentId/revoke',checkInstructor,revokeEnrollment)

export default router;