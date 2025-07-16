
import Cart from '../Models/cartModel.js'
import Order from '../Models/orderModel.js'
import Product from '../Models/productModel.js'

export const placeOrder = async (req,res) => {
    try {
       const {shippingAddress,paymentMethod} = req.body
       const userId = req.id
       if(!userId) return res.status(400).json({success:false,message:"User not found"})
       if(!paymentMethod) return res.status(400).json({success:false,message:"Payment method required"})

        const cart = await Cart.findOne({userId}).populate('items.productId')
        if(!cart || cart.items.length === 0){
            console.log("cart is empty");
            return res.status(400).json({success:false,message:"Cart us empty"})
        }
        let message;
        for (const item of cart.items) {
            const size = item.selectedSize
            const qty = item.quantity
          
            if(item.productId.sizes && item.productId.sizes.length){
               const sizeStock = item.productId.sizes.find(s => s.size === size)
               if(qty > sizeStock.stock){
                  message = `${item.productId.name} is out of stock`
                  return;
                }
           }
        }

        if(message){
          return res.status(400).json({success:false,message})
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

// get Order

export const getOrders = async (req,res) => {
     try {
        const userId = req.id
        if(!userId) return res.status(400).json({success:false,message:"user not found"})
        const orders = await Order.findOne({userId}).populate('items.productId')
     } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:error.message}) 
     }
}