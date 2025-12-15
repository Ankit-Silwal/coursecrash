import { loginAdmin } from "./adminlogin.mjs";
import { getAllRequest, grantAllRequest, grantuser } from "../admin.makeinstructor/instructorfunction.mjs";
import {checkAdmin} from "../../../middlewares/checkAdmin.mjs"
import { Router } from "express";
const router=Router()
router.post('/login',loginAdmin)
router.get('/getallrequest',checkAdmin,getAllRequest)
router.post('/grantallrequest',checkAdmin,grantAllRequest)
router.post('/grantuser:username',grantuser)
export default router;

