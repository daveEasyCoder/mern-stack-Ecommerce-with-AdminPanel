import express from 'express'
import { changePassword, forgotPassword, getAllUser, getProfile, login, Logout, register, resetPassword, verifyEmail } from '../controllers/userController.js'
import { authUser, isAdmin } from '../Middlewares/authMiddleware.js'

const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.post("/logout",authUser,Logout)
router.post("/change-password",authUser,changePassword)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password/:token",resetPassword)
router.get('/verify-email/:token', verifyEmail);
router.get('/me',authUser,getProfile);
router.get('/admin/me',authUser,isAdmin, getProfile);
router.get('/get-all-users',authUser,isAdmin, getAllUser);

export default router