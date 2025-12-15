import { loginAdmin } from "./adminlogin.mjs";
import { blockinstructor, getAllRequest, grantAllRequest, grantuser, deleteuser, viewAllUsers, viewAllInstructors, viewAllBlockedInstructors, unblockinstructor } from "../admin.makeinstructor/instructorfunction.mjs";
import {checkAdmin} from "../../../middlewares/checkAdmin.mjs"
import { Router } from "express";
const router=Router()

router.post('/admin/login',loginAdmin)

router.get('/admin/instructor-applications',checkAdmin,getAllRequest)
router.post('/admin/instructor-applications/:applicationId/approve',checkAdmin,grantuser)
router.post('/admin/instructor-applications/:applicationId/reject',checkAdmin,blockinstructor)

router.get('/admin/users',checkAdmin,viewAllUsers)
router.delete('/admin/users/:userId',checkAdmin,deleteuser)

router.post('/admin/instructors/:userId/block',checkAdmin,blockinstructor)
router.post('/admin/instructors/:userId/unblock',checkAdmin,unblockinstructor)

export default router;

