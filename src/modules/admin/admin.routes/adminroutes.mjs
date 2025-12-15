import { loginAdmin } from "./adminlogin.mjs";
import { blockinstructor, getAllRequest, grantAllRequest, grantuser, deleteuser } from "../admin.makeinstructor/instructorfunction.mjs";
import {checkAdmin} from "../../../middlewares/checkAdmin.mjs"
import { Router } from "express";
const router=Router()
router.post('/login',loginAdmin)
router.get('/getallrequest',checkAdmin,getAllRequest)
router.post('/grantallrequest',checkAdmin,grantAllRequest)
router.post('/grantuser/:username',grantuser)
router.post('/blockinstructor/:username',blockinstructor)
router.delete('/deleteuser/:username',deleteuser)

export default router;

