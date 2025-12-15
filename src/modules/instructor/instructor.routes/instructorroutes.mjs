import { Router } from "express";
import { postCourses } from "../instructor.controller/postcourses.mjs";
import { checkInstructor } from "../../../middlewares/checkinstructor.mjs";
import { getCourses } from "../instructor.controller/getcourses.mjs";
import { deleteCourses } from "../instructor.controller/deleteCourses.mjs";
import { approveEnrollment, revokeEnrollment } from "../instructor.controller/enrollmentManagement.mjs";
import { createLesson, getLessonsByCourse, deleteLesson } from "../instructor.controller/lessonController.mjs";
import { publishCourse, unpublishCourse } from "../instructor.controller/courseManagement.mjs";

const router=Router()
router.post('/courses',checkInstructor,postCourses)
router.get('/courses',checkInstructor,getCourses)
router.delete('/courses/:courseId',checkInstructor,deleteCourses)
router.post('/courses/:courseId/publish',checkInstructor,publishCourse)
router.post('/courses/:courseId/unpublish',checkInstructor,unpublishCourse)
router.post('/enrollments/:enrollmentId/approve',checkInstructor,approveEnrollment)
router.post('/enrollments/:enrollmentId/revoke',checkInstructor,revokeEnrollment)
router.post('/courses/:courseId/lessons',checkInstructor,createLesson)
router.get('/courses/:courseId/lessons',checkInstructor,getLessonsByCourse)
router.delete('/lessons/:lessonId',checkInstructor,deleteLesson)

export default router;