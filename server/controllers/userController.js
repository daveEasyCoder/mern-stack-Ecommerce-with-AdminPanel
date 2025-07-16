
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from "../Models/userModel.js";
// import cookie from ''

export const register = async (req,res) => {
    try {
        const {fullname,email,password} = req.body
        if(!fullname || !email || !password){
            return res.status(400).json({success:false,message:"All fields are required"})
        }

       const existUser = await User.findOne({email})
       if(existUser){
        console.log("User already exist")
        return res.status(400).json({success:false,message:"User already exist"})
       }
       const hashedPassword = await bcrypt.hash(password,10)
       const newUser = await new User({
        fullname,
        email,
        password:hashedPassword
       })

       await newUser.save()
    //    generate token
       const token = jwt.sign(
        {id:newUser._id},
         process.env.JWT_SECRET_KEY,
         {expiresIn:'2d'}
       )

       res.cookie("token",token)
      return res.status(200).json({success:true,message:"Registered successfully"})

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Internal server error"})     
    }
}


export const login = async (req,res) => {
    try {
        const {email,password} = req.body
        if(!email || !password) return res.status(400).json({success:false,message:"All fields are required"})
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({success:false,message:"Invalid email address"})
        
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(400).json({success:false,message:"Invalid password"})

        const token = jwt.sign(
           { id:user._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:'1d'}
        )

           res.cookie('token',token,{
            httpOnly:true,
            secure:false,
            sameSite:'strict',
            maxAge:24*60*60*1000 
        })
        const savedUser =  {
            id:user._id,
            email:user.email,
            fullname:user.fullname
        }

        return res.status(200).json({success:true,user:savedUser,message:"Logged in successfull"})
    } catch (error) {
         console.log(error);
        res.status(500).json({success:false,message:"Internal server error"})     
    }
}