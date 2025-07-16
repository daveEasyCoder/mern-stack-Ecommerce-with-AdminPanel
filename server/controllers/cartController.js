import Cart from "../Models/cartModel.js";
import Product from '../Models/productModel.js'

export const addToCart = async (req,res) => {
    try {
        const {quantity,selectedSize} = req.body
        const productId = req.params.id
        const userId = req.id
        if(!userId){
            console.log("user not found")
            return res.status(400).json({success:false,message:"user not found"})
        }

        let cart = await Cart.findOne({userId:userId})
        if(!cart){
            cart =  new Cart({userId:userId,items:[]})
        }
        let message;
        const existItemIndex = cart.items.findIndex(item => item.productId.toString() === productId && item.selectedSize === selectedSize)
        if(existItemIndex > -1){
            cart.items[existItemIndex].quantity += 1;
            message = "Item already in cart. quantity increased by 1"
            
        }else{
            cart.items.push({
                productId,
                quantity,
                selectedSize:selectedSize || ""
            })
           message = "successfully added to cart"
        }
        await cart.save()

       const updatedCart = await Cart.findOne({userId}).populate({path:"items.productId"})

        return res.status(200).json({success:true,cart:updatedCart,message})
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Internal server error"})   
    }
}

export const getCart = async (req,res) => {
    try {
        const userId = req.id
        if(!userId) return res.status(400).json({success:false,message:"user not found"})
        const carts = await Cart.findOne({userId}).populate({path:"items.productId"})
        if(!carts){
            return res.status(200).json({success:true,carts:{items:[]}})
        }
        return res.status(200).json({success:true,carts})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Internal server error"}) 
    }
}

export const deleteCartItem = async (req,res) => {
    try {
        const userId = req.id
        const cartItemId = req.params.id
        const cart = await Cart.findOne({userId:userId})
        if(!cart){
            console.log("cart items not exist");
            return res.status(400).json({success:false,message:"cart item does not exist"})
        }

        cart.items = cart.items.filter(item => item._id.toString() !== cartItemId)
        await cart.save()
        
        const carts = await Cart.findOne({userId}).populate({path:"items.productId"})
       return res.status(200).json({success:true,carts,message:"item deleted successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Internal server error"}) 
    }
}


export const updateQuantity = async (req,res) => {
    try {
        const {id} = req.params
        const {action} = req.body
        const userId = req.id
        const cart = await Cart.findOne({userId})
        if(!cart){
            return res.status(400).json({success:false,message:"Cart not found"})
        }

        cart.items.forEach((item) => {
           if(item._id.toString() === id){
              if(action === "increase"){
                item.quantity += 1;
              }else if(action === "decrease"){
                 item.quantity = Math.max(1, item.quantity - 1); 
              }
           }
        })
        await cart.save()
        const updatedCart = await Cart.findOne({userId}).populate({path:"items.productId"})
        return res.status(200).json({success:true,carts:updatedCart})
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Internal server error"}) 
    }
}