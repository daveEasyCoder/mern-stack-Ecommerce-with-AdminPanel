import mongoose from "mongoose";

const cartItem = new mongoose.Schema({
    productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
    quantity:{type:Number,default:1},
    selectedSize:{type:String,default:""}
},{timestamps:true})
const cartSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    items:[cartItem]

},{timestamps:true})

const Cart = mongoose.model("Cart",cartSchema)

export default Cart