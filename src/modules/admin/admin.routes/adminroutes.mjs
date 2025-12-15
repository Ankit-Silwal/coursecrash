import { loginAdmin } from "./adminlogin.mjs";
import { blockinstructor, getAllRequest, grantAllRequest, grantuser, deleteuser, viewAllUsers, viewAllInstructors, viewAllBlockedInstructors, unblockinstructor } from "../admin.makeinstructor/instructorfunction.mjs";
import {checkAdmin} from "../../../middlewares/checkAdmin.mjs"
import { Router } from "express";
const router=Router()

router.post('/login',loginAdmin)

router.get('/instructor-applications',checkAdmin,getAllRequest)
router.post('/instructor-applications/:instructorId/approve',checkAdmin,grantuser)
router.post('/instructor-applications/:instructorId/reject',checkAdmin,blockinstructor)

router.get('/ausers',checkAdmin,viewAllUsers)
router.delete('/users/:userId',checkAdmin,deleteuser)

router.post('/instructors/:instructorId/block',checkAdmin,blockinstructor)
router.post('/instructors/:instructorId/unblock',checkAdmin,unblockinstructor)

export default router;

