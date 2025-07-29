
import User from '../Models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Product from '../Models/productModel.js'
import Order from '../Models/orderModel.js'
import { sendVerificationEmail } from '../config/sendMail.js'

export const registerAdmin = async (req,res) => {
    const {email,password,fullname,secretCode} = req.body
    
   if(!email || !password || !fullname) return res.status(400).json({success:false,message:"All field are required"})
    try {
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({success:true,message:"User already exist"})
        }
        if(secretCode !== process.env.ADMIN_SECRET_CODE){
            console.log("Invalid secret code")
            return res.status(400).json({success:false,message:"Invalid secret code"})
        }
        const hashPassword = await bcrypt.hash(password,10)
        const newUser = new User({
            fullname,
            email,
            password:hashPassword,
            role:"admin"
        })
        await newUser.save()
        // generate token for admin
        const token = jwt.sign(
           {id:newUser._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:'2d'}
          )

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:'strict',
        })

        // generate token for email verification
             const emailToken = jwt.sign(
                 { id:newUser._id},
                  process.env.JWT_EMAIL_SECRET,
                 {expiresIn:'5min'}
          )
 
           const baseUrl = process.env.BASE_URL || 'http://localhost:5173'
            const link = `${baseUrl}/verify-admin-email/${emailToken}`;
            const subject = "Admin Authentication"
            const html =  `
                        <h3>Admin Email verification</h3>
                        <p>Click the link below to verify you are admin:</p>
                        <p><a href='${link}' style="color: blue;">Verify whether you are admin</a></p>
                    `
                      
          await sendVerificationEmail(email,subject,html)
        
        return res.status(200).json({success:true,message:"A verification link has been sent to your email"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}


// verify admin email

export const verifyAdminEmail = async (req, res) => {
  try {
    const { token } = req.params;
     if(!token){
        console.log("Token not found");
        return res.status(400).json({success:false,message:"token not found"})
     }
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    const admin = await User.findById(decoded.id);
    if (!admin) return res.status(400).json({success:false,message:'Invalid token'});
     
    admin.isVerified = true;
    await admin.save();

    return res.status(200).json({success:true,message:"Admin Email verified successfully!"})
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid or expired token');
  }
};

export const adminLogin = async (req,res) => {
   const {email,password} = req.body
   if(!email || !password) return res.status(400).json({success:false,message:"All field are required"})
    
    try {
        const user = await User.findOne({email})
        if(!user){
            console.log("Invalid email address");
            return res.status(400).json({success:false,message:"Invalid Email"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            console.log("Invalid Password");
            return res.status(400).json({success:false,message:"Invalid Password"})
        }
    
        if(user.role !== "admin"){
            console.log("you are not admin");
            return res.status(401).json({success:false,message:"you are not allowed to login"})
        }

        if(!user.isVerified){
            console.log("Your account not verified");
            return res.status(400).json({success:false,message:"Account not verified. Verification link sent to your email"})
        }

     // generate token for admin
           const token = jwt.sign(
                 { id:user._id},
                 process.env.JWT_SECRET_KEY,
                 {expiresIn:'1d'}
          )

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:'strict',
        })

          const savedUser =  {
            id:user._id,
            email:user.email,
            fullname:user.fullname
        }

         return res.status(200).json({success:true,user:savedUser})

    } catch (error) {
         console.log(error);
         return res.status(500).json({ success: false, message: "Internal server error" });
    }
}



export const getStatus = async (req,res) => {
    try {
        // count total product
        const totalProduct = await Product.countDocuments()

        //count total user
        const totalUser = await User.countDocuments()

        // count total order
        const totalOrder = await Order.countDocuments()
   
        // cancelled order
        const cancelledOrder = (await Order.find({status:"cancelled"})).length

        // pending order
        const pendingOrder = (await Order.find({status:"order-placed"})).length

        // total revenue and completed order
        const order = await Order.find({status:"delivered"})
        const totalRevenue = order.reduce((acc,ord) => acc + ord.totalPrice, 0)
        const completedOrders = order.length

        const count = {
            totalProduct,
            totalOrder,
            totalUser,
            totalRevenue,
            completedOrders,
            cancelledOrder,
            pendingOrder
        }
       
        return res.status(200).json({success:true,count})
        
    } catch (error) {
         console.log(error);
         return res.status(500).json({ success: false, message: "Internal server error" });
    }
}