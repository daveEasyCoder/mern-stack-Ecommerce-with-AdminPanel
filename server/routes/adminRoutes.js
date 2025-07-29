import express from 'express'
import { adminLogin, getStatus, registerAdmin, verifyAdminEmail } from '../controllers/adminController.js'
import {isAdmin,authUser} from '../Middlewares/authMiddleware.js'

const router = express.Router()

router.post("/admin-login",adminLogin)
router.post("/admin-register",registerAdmin)  
router.get("/verify-admin-email/:token",verifyAdminEmail)  
router.get("/get-status",authUser,isAdmin,getStatus)  

export default router