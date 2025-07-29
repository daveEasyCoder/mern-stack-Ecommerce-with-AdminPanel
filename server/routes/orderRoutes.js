import express from 'express'
import {authUser, isAdmin} from '../Middlewares/authMiddleware.js'
import { getAllOrders, getOrders, getSingleOrderItem, getUserOrder, placeOrder, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router()

router.post("/place-order",authUser,placeOrder)
router.get("/get-myorder",authUser,getOrders)
router.get("/get-all-orders",authUser,isAdmin,getAllOrders) //for admin only
router.post("/update-status",authUser,isAdmin,updateOrderStatus) // for admin
router.get('/get-order-item/:orderId/item/:itemId', authUser,getSingleOrderItem);
router.get('/get-user-order/:id', authUser,isAdmin,getUserOrder); // for admin


export default router