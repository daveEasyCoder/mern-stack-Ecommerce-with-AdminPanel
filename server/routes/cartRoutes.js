import express from 'express'
import { authUser } from '../Middlewares/authMiddleware.js'
import { addToCart, deleteCartItem, getCart, updateQuantity } from '../controllers/cartController.js'

const router = express.Router()

router.post("/add-to-cart/:id",authUser,addToCart)
router.get("/get-cart",authUser,getCart)
router.delete("/delete-cart-item/:id",authUser,deleteCartItem)
router.post("/update-quantity/:id",authUser,updateQuantity)

export default router