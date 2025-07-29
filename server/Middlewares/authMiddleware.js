import jwt from 'jsonwebtoken'
import User from '../Models/userModel.js'
export const authUser = async (req,res,next) => {
    try {
        const token = req.cookies.token
     
        if(!token){
            return res.status(401).json({success:false,message:"'Unauthorized  access"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        const user = await User.findById(decoded.id)
        
        if(!user) return res.status(401).json({success:false,message:"unauthorized access"})
        req.user = user
        next()
       
    } catch (error) {
        console.log(error);
         return res.status(403).json({ success: false, message: 'Invalid token' });
    }
}


export const isAdmin = async (req,res,next) => {
  if(req.user && req.user.role === "admin"){
    next()
  }else{
    return res.status(401).json({success:false,message:"Access denied: admin only"})
  }
}