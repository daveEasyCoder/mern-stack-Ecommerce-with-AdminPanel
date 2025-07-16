import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    originalPrice: {
        type: Number,
        required: true,
    },
    discountedPrice: {
        type: Number,
        required: true,
    },
     discount: {
        type: Number, 
        default: 0
     },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: [String],
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    sizes: [{
        size:{type:String,required:true},
        stock:{type:Number,required:true}
    }],
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    default:""
  },

}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;