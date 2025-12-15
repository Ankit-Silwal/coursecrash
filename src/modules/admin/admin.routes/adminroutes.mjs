import { loginAdmin } from "./adminlogin.mjs";
import { Router } from "express";
const router=Router()
router.post('/login',loginAdmin)
export default router;

