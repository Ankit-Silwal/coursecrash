import { loginAdmin } from "./adminlogin.mjs";
import { getAllRequest } from "../admin.makeinstructor/instructorfunction.mjs";
import {checkAdmin} from "../../../middlewares/checkAdmin.mjs"
import { Router } from "express";
const router=Router()
router.post('/login',loginAdmin)
router.get('/getallrequest',checkAdmin,getAllRequest)
export default router;

