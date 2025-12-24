import { loginAdmin } from "./adminlogin.mjs";
import { blockinstructor, getAllRequest, grantAllRequest, grantuser, deleteuser, viewAllUsers, viewAllInstructors, viewAllBlockedInstructors, unblockinstructor } from "../admin.makeinstructor/instructorfunction.mjs";
import { blockCourse, unblockCourse } from "../admin.makeinstructor/courseBlockManagement.mjs";
import {checkAdmin} from "../../../middlewares/checkAdmin.mjs"
import { Router } from "express";
const router=Router()

router.post('/login',loginAdmin)

router.get('/instructor-applications',checkAdmin,getAllRequest)
router.post('/instructor-applications/:instructorId/approve',checkAdmin,grantuser)
router.post('/instructor-applications/:instructorId/reject',checkAdmin,blockinstructor)

router.get('/allusers',checkAdmin,viewAllUsers)
router.delete('/users/:userId',checkAdmin,deleteuser)
router.get('/allinstructors',checkAdmin,viewAllInstructors)
router.get('/blocked-instructors',checkAdmin,viewAllBlockedInstructors)

router.post('/instructors/:instructorId/block',checkAdmin,blockinstructor)
router.post('/instructors/:instructorId/unblock',checkAdmin,unblockinstructor)

router.post('/courses/:courseId/block',checkAdmin,blockCourse)
router.post('/courses/:courseId/unblock',checkAdmin,unblockCourse)

export default router;

