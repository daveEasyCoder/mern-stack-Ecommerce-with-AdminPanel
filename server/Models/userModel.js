import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{type:String, require:true},
    email:{type:String, require:true, unique:true},
    password:{type:String, require:true},
    isVerified: { type: Boolean, default: false },
    role:{type:String,enum:['user','admin'],default:'user'}
})

const User = mongoose.model("User",userSchema)

export default User