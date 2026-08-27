import mongoose from "mongoose";



const passwordStorageSchema = new mongoose.Schema({
// userId field ek reference hai User model ke ObjectId ka.
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userModel",
        required:true
    },
    // yaha pe mai password storage ka schema banaya hu 
    appName:{
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
    }
},{timestamps:true})


const passwordStorageModel = mongoose.model("passwordStorage",passwordStorageSchema);


export default passwordStorageModel