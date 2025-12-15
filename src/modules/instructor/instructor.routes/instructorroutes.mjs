import { Router } from "express";
import { postCourses } from "../instructor.controller/postcourses.mjs";
import { checkInstructor } from "../../../middlewares/checkinstructor.mjs";
import { getCourses } from "../instructor.controller/getcourses.mjs";
import { deleteCourses } from "../instructor.controller/deleteCourses.mjs";

const router=Router()
router.post('/courses',checkInstructor,postCourses)
router.get('/courses',checkInstructor,getCourses)
router.delete('/courses/:courseId',checkInstructor,deleteCourses)

export default router;