
import { stat } from 'fs'
import Cart from '../Models/cartModel.js'
import Order from '../Models/orderModel.js'
import Product from '../Models/productModel.js'

export const placeOrder = async (req,res) => {
    try {
       const {shippingAddress,paymentMethod} = req.body
      const userId = req.user._id
       if(!userId) return res.status(400).json({success:false,message:"User not found"})
       if(!paymentMethod) return res.status(400).json({success:false,message:"Payment method required"})

        const cart = await Cart.findOne({userId}).populate('items.productId')
        if(!cart || cart.items.length === 0){
            console.log("cart is empty");
            return res.status(400).json({success:false,message:"Cart is empty"})
        }

        for (const item of cart.items) {
            const size = item.selectedSize
            const qty = item.quantity
        
            if(item.productId.sizes && item.productId.sizes.length){
               const sizeStock = item.productId?.sizes.find(s => s.size === size)
               if(!sizeStock) return res.status(400).json({success:false,message:`${item.productId.name} does not have size ${size}`})
               if(qty > sizeStock.stock){
                  const message = `${item.productId.name} is out of stock`
                 return res.status(400).json({success:false,message})
                }
           }
        }

        const orderItems = cart.items.map(item => {
            return {
                productId:item.productId._id,
                quantity:item.quantity,
                selectedSize:item.selectedSize,
                price:item.productId.discountedPrice
            }
        })
        // total Price
        const totalPrice = cart.items.reduce((acc,item) => (acc + item.quantity * item.productId.discountedPrice),0)

        // create new Order
       const newOrder = new Order({
         userId,
         items:orderItems,
         shippingAddress,
         totalPrice,
         paymentMethod,
       })
        await newOrder.save()

        // decreament the stock
       for (const item of cart.items) {
            const size = item.selectedSize
            const qty = item.quantity
            const productId = item.productId
            const product = await Product.findOne(productId)
            let productStock = product.sizes.find(s => s.size === size)
            productStock.stock -= qty
            await product.save()         
        }

        // clear cart Item
        await Cart.findOneAndDelete({userId})

        return res.status(200).json({success:true,message:"order placed successfully"})
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:error.message})    
    }
}

// get my Order
export const getOrders = async (req,res) => {
     try {
        const userId = req.user._id
        
        if(!userId) return res.status(400).json({success:false,message:"user not found"})
        const orders = await Order.find({userId}).populate('items.productId').populate({path:"userId", select:"fullname email"})
        
        return res.status(200).json({success:true,orders})
     } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:error.message}) 
     }
}

// GET ORDER OF USER FOR ADMIN
export const getUserOrder = async (req,res) => {

     const {id} = req.params
     console.log(id);
     
     try {
        const userId = req.user._id
        
        if(!userId) return res.status(400).json({success:false,message:"user not found"})
        const order = await Order.find({userId:id}).populate('items.productId').populate({path:"userId", select:"fullname email"})
        
        return res.status(200).json({success:true,order})
     } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:error.message}) 
     }
}

// GET ALL ORDERS FOR ADMIN
export const getAllOrders = async (req,res) => {
     try {
        const userId = req.user._id
        
        if(!userId) return res.status(400).json({success:false,message:"user not found"})
        const orders = await Order.find().populate('items.productId').populate({path:"userId", select:"fullname email"})
        
        return res.status(200).json({success:true,orders})
     } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:error.message}) 
     }
}

export const getSingleOrderItem = async (req,res) => {
    const { orderId, itemId} = req.params
    try {
        const order = await Order.findById(orderId).populate('items.productId')
        if(!order){
            console.log("Order not found")
            return res.status(400).json({success:false,message:"Order not found"})
        }
        const orderItem = order.items.find(item => item._id.toString() === itemId)
       if(!orderItem){
          console.log("Order item is not found");
          return res.status(200).json({success:false,message:"Order item not found"})
       }
      
       return res.status(200).json({success:true,orderItem,order})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:error.message}) 
    }
}

export const updateOrderStatus = async (req,res) => {
    try {
        const {status,orderId} = req.body
        if(!status){
            console.log("order status is not found"); 
            return res.status(400).json({success:false,message:"order status is not found"})   
        }
        if(!orderId){
            return res.status(400).json({success:false,message:"orderId not found"})
        }
        const validateStatus = ["delivered","shipped","cancelled","order-placed"]
        if(!validateStatus.includes(status)){
            return res.status(400).json({success:false,message:"invalid order status"})
        }
        const order = await Order.findById(orderId)
        if(!order){
            console.log("order not found");
            return res.status(404).json({success:false,message:"order not found"})
        }
        order.status = status
        await order.save()
        return res.status(200).json({success:true,message:"status updated successfully"})
        
        
    } catch (error) {
         console.log(error);
        return res.status(500).json({success:false,message:error.message}) 
    }
}