import express from 'express'
import {authUser} from '../Middlewares/authMiddleware.js'
import { placeOrder } from "../controllers/orderController.js";

const router = express.Router()

router.post("/place-order",authUser,placeOrder)

export default router