import mongoose from 'mongoose'

const orderItem = new mongoose.Schema({
     productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
     quantity:{type:Number,default:1},
     selectedSize:{type:String,default:""},
     price:{type:Number,required:true}
})

const orderSchema = new mongoose.Schema({
     userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
     items:[orderItem],
     shippingAddress: {
        fullname:{type:String,required:true},
        address:{type:String,required:true},
        city:{type:String,required:true},
        postalCode:{type:String,default:""}
     },
     totalPrice:{type:Number,required:true},
     paymentMethod:{type:String},
     status:{type:String,enum:["processing","shipped","delivered"],default:"processing"}
},{timestamps:true})

const Order = mongoose.model("Order",orderSchema)
export default Order