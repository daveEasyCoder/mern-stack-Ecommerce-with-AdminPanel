import express from 'express'
import upload from '../config/multer.js';
import { authUser } from '../Middlewares/authMiddleware.js';
import { addProduct, editProduct, getIndividualProduct, getProduct, getProductByCategory } from '../controllers/productController.js'


const router = express.Router();

router.post("/add-product",upload.array("image"),addProduct);
router.put("/edit-product/:id",upload.array("newImages"),editProduct);
router.get("/get-product",getProduct);
router.get("/get-each-product/:id",getIndividualProduct);
router.get("/get-product-category/:category",getProductByCategory);

export default router;