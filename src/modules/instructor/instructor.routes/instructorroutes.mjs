import { Router } from "express";
import { postCourses } from "../instructor.controller/postcourses.mjs";
import { checkInstructor } from "../../../middlewares/checkinstructor.mjs";
import { getCourses } from "../instructor.controller/getcourses.mjs";
import { deleteCourses } from "../instructor.controller/deleteCourses.mjs";
import { approveEnrollment, revokeEnrollment } from "../instructor.controller/enrollmentManagement.mjs";
import { createLesson, getLessonsByCourse, deleteLesson } from "../instructor.controller/lessonController.mjs";
import { publishCourse, unpublishCourse } from "../instructor.controller/courseManagement.mjs";
import { getReadUrl, getsignedurl, putLessonUrl } from "../instructor.controller/supaBaseManagement.mjs";
import { getAllEnrollmentReq, getSpecificEnrollmentReq, acceptSpecificEnrollmentReq, rejectSpecificEnrollmentReq, acceptAllEnrollmentReq, rejectAllEnrollmentReq } from "../instructor.controller/enrollManager.mjs";

const router=Router()
router.post('/courses',checkInstructor,postCourses)
router.get('/courses',checkInstructor,getCourses)
router.delete('/courses/:courseId',checkInstructor,deleteCourses)
router.post('/courses/:courseId/publish',checkInstructor,publishCourse)
router.post('/courses/:courseId/unpublish',checkInstructor,unpublishCourse)


router.post('/enrollments/:enrollmentId/approve',checkInstructor,approveEnrollment)
router.post('/enrollments/:enrollmentId/revoke',checkInstructor,revokeEnrollment)
router.get('/enrollments',checkInstructor,getAllEnrollmentReq)
router.get('/enrollments/:enrollmentId',checkInstructor,getSpecificEnrollmentReq)
router.post('/enrollments/:enrollmentId/accept',checkInstructor,acceptSpecificEnrollmentReq)
router.post('/enrollments/:enrollmentId/reject',checkInstructor,rejectSpecificEnrollmentReq)
router.post('/enrollments/accept-all',checkInstructor,acceptAllEnrollmentReq)
router.post('/enrollments/reject-all',checkInstructor,rejectAllEnrollmentReq)


router.post('/courses/:courseId/lessons',checkInstructor,createLesson)
router.get('/courses/:courseId/lessons',checkInstructor,getLessonsByCourse)
router.delete('/lessons/:lessonId',checkInstructor,deleteLesson)

router.post('/uploads/sign',checkInstructor,getsignedurl)
router.post('/lessons/update-url',checkInstructor,putLessonUrl) 

export default router;