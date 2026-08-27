

import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    token:{
        type:String
        
    }
},{timestamps:true});


const userModel = mongoose.model("userModel",userSchema);

export default userModel