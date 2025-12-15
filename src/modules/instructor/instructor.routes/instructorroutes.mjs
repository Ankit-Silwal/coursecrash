import { Router } from "express";
import { postCourses } from "../instructor.controller/postcourses.mjs";
import { checkInstructor } from "../../../middlewares/checkinstructor.mjs";

const router=Router()
router.post('/courses',checkInstructor,postCourses)
export default router;