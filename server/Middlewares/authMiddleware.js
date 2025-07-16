import jwt from 'jsonwebtoken'
export const authUser = async (req,res,next) => {
    try {
        const token = req.cookies.token
        if(!token){
            // console.log("Unauthorized  access");
            return res.status(401).json({success:false,message:"'Unauthorized  access"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.id = decoded.id
        next()
       
    } catch (error) {
        console.log(error);
         return res.status(403).json({ success: false, message: 'Invalid token' });
    }
}