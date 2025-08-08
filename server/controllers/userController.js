
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from "../Models/userModel.js";
import { sendVerificationEmail } from '../config/sendMail.js';
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
       const newUser = new User({
        fullname,
        email,
        password:hashedPassword,
        isVerified:false
       })

       await newUser.save()
    // generate token for login
       const token = jwt.sign(
        {id:newUser._id},
         process.env.JWT_SECRET_KEY,
         {expiresIn:'1d'}
       )
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:'none',
            maxAge:24*60*60*1000 
        })

        // generate token for Email verification
          const verificationToken = jwt.sign(
            {id:newUser._id},
            process.env.JWT_EMAIL_SECRET,
            {expiresIn:'2d'}
          )
          const baseUrl = process.env.BASE_URL || 'http://localhost:5173'
          const link = `${baseUrl}/verify-email/${verificationToken}`;
          const subject = "Email Verification"
          const html =  `
            <h3>Email Verification</h3>
            <p>Click the link below to verify your email:</p>
           <p><a href='${link}' style="color: blue;">Verify Email</a></p>
        `
       await sendVerificationEmail(email,subject, html);
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
        if(!user.isVerified){
          // generate token for Email verification
            const verificationToken = jwt.sign(
              {id:user._id},
              process.env.JWT_EMAIL_SECRET,
              {expiresIn:'2d'}
            )
            const baseUrl = process.env.BASE_URL || 'http://localhost:5173'
            const link = `${baseUrl}/verify-email/${verificationToken}`;
            const subject = "Email Verification"
            const html =  `
                        <h3>Email Verification</h3>
                        <p>Click the link below to verify your email:</p>
                        <p><a href='${link}' style="color: blue;">Verify Email</a></p>
                    `
            await sendVerificationEmail(email,subject, html);
            return res.status(400).json({success:false,message:"Account not verified! Please verify your email to activate your account."})
          }
           res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:'none',
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


export const Logout = async (req,res) => {
  try {
    res.clearCookie('token',{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:'none',
    })
    res.status(200).json({success:true,message:"logged out successfully"})
  } catch (error) {
      console.log(error);
      res.status(500).json({success:false,message:"Internal server error"})    
  }
}

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
     if(!token){
        console.log("Token not found");
        return res.status(400).json({success:false,message:"token not found"})
     }
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({success:false,message:'Invalid token'});

    user.isVerified = true;
    await user.save();

    return res.status(200).json({success:true,message:"Email verified successfully!"})
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid or expired token');
  }
};



// CHANGE PASSWORD
export const changePassword = async (req,res) => {
  const {oldPassword,newPassword,confirmNewPassword} = req.body
  const userId = req.user._id
  
  if(!oldPassword || !newPassword || !confirmNewPassword){
    return res.status(400).json({success:false,message:"all fields are required"})
  }
  if(newPassword !== confirmNewPassword){
    return res.status(400).json({success:false,message:"Password is not match"})
  }
  
    if(!userId){
    console.log("user not found");
    return res.status(400).json({success:false,message:"user not found"})
  }

  try {
      const user = await User.findById(userId)
      if(!user){
        console.log("user not found");
        return res.status(400).json({success:false,message:"user not found"})
      }
      if(await bcrypt.compare(newPassword,user.password)){
        return res.status(400).json({success:false,message:"New Password should be different from current"})
      }

      const checkPass = await bcrypt.compare(oldPassword,user.password)
      if(!checkPass){
        console.log("Your old password is wrong");
        return res.status(400).json({success:false,message:"Your old password is wrong"})
      }
      const hashedPass = await bcrypt.hash(newPassword,10)
      user.password = hashedPass
      await user.save()
      
      return res.status(200).json({success:true,message:"password changed successfully"})

  } catch (error) {
     console.log(error);
     res.status(500).json({success:false,message:"Internal server error"})   
  }
}

// FORGOT PASSWORD
export const forgotPassword = async (req,res) => {
  const {email} = req.body
  if(!email){
    console.log("Email is required");
    return res.status(400).json({success:false,message:"Email is required"})
  }
  try {
      const user = await User.findOne({email})
      if(!user){
        console.log("User not found");
        return res.status(404).json({success:false,message:"User not found"})
      }
      const token = jwt.sign(
        {id:user._id},
        process.env.JWT_RESET_SECRET,
        {expiresIn:'30min'}
      )
       const baseUrl = process.env.BASE_URL || 'http://localhost:5173'
       const link = `${baseUrl}/reset-password/${token}`;
       const subject = "Reset Password"
        const html =  `
                    <h3>Forgot Password</h3>
                    <p>Click the link below to verify your email:</p>
                    <p><a href='${link}' style="color: blue;">Reset Password</a></p>
                `
            
        await sendVerificationEmail(email,subject,html)
      
        return res.status(200).json({success:true,message:"Reset link sent to your email."})


  } catch (error) {
     console.log(error);
     res.status(500).json({success:false,message:"Internal server error"})  
  }
}

// RESET PASSWORD

export const resetPassword = async(req,res) => {
    const {newPassWord,confirmNewPassWord} = req.body
    const {token} = req.params
    
    if(!token){
      console.log("Token not found");
      return res.status(400).json({success:false,message:"token not found"})
     }

      if(!newPassWord || !confirmNewPassWord){
        console.log("password is required");  
        return res.status(400).json({success:false,message:"Password is required"})
      }
      if(newPassWord !== confirmNewPassWord){
        console.log("password not match");  
        return res.status(400).json({success:false,message:"Password not match"})
      }
    try {
         const decoded = jwt.verify(token,process.env.JWT_RESET_SECRET)
         const user = await User.findById(decoded.id)
         if(!user){
           console.log("Invalid token");
           return res.status(400).json()
         }
         const hashedPass = await bcrypt.hash(newPassWord,10)
         user.password = hashedPass
         await user.save()

         return res.status(200).json({success:true,message:"Password resetted successfully."})

    } catch (error) {
       console.log(error);
       res.status(500).json({success:false,message:"Internal server error"}) 
    }

}

// GET PROFILE
export const getProfile = async (req,res) => {
    const userId = req.user._id
    if(!userId){
        console.log("User id is not found");
        return res.status(400).json({success:false,message:"User id not found"})
    }
    try {
        const user = await User.findById(userId).select("-password")
        if(!user){
            console.log("User not found");
            return res.status(400).json({success:false,message:"User not found"})
        }

        return res.status(200).json({success:true,user})

    } catch (error) {
        console.log(error);
        return res.status(200).json({success:false,message:"Interval server Error"})
    }
   
}


// for admin only

export const getAllUser = async (req,res) => {
  try {
      const users = await User.find({}).select('-password')
      return res.status(200).json({success:true,users})
  } catch (error) {
       console.log(error);
       return res.status(200).json({success:false,message:"Interval server Error"})
  }
}
