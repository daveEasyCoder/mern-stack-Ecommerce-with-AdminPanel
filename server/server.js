import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
dotenv.config();
const app = express();

app.use(cors({
  origin: 'https://react-fronted-ecommerce.vercel.app/',
  credentials: true 
}));
app.use(express.json())
app.use(express.static('uploads'))
app.use(cookieParser())

app.use("/api/product/",productRoutes)
app.use("/api/user/",userRoutes)
app.use("/api/cart/",cartRoutes)
app.use("/api/order/",orderRoutes)
app.use("/api/admin/",adminRoutes)


mongoose.connect(process.env.MONGO_URL).then(con => {
    console.log("mongoDB connected");
    
})

const PORT = process.env.PORT || 301;

app.listen(PORT, ()=> {
 console.log("running on port",PORT);
})
