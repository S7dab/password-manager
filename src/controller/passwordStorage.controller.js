import passwordStorageModel from "../model/passwordStorage.js"

import CryptoJS from "crypto-js";


// for creating password storage
const createPassword = async (req,res)=>{
    
try {
    console.log("req",req.user)
    const id = req.user.id;
    const {appName,email,password} = req.body;

   
    // validation of empty or not
    if(!appName || !email || !password || appName.trim().length <= 0 || email.trim().length <= 0 || password.trim().length <= 0){
        res.status(400).json({status:false,message:"all field required"})
    }
     // checking is credential exist already or not
    const isCredentialExist = await passwordStorageModel.find({
        $and:[{userId:id},{appName:appName},{email:email}]
    })
    if(isCredentialExist.length > 0){
        return res.status(409).json({status:false,message:"credential already exist try another"})
    }

    // creating hashed or encrypted password 
const encryptedPassword =  CryptoJS.AES.encrypt(password , process.env.PASSWORD_SECRET_KEY).toString();

    // creating credential or user passwords and id's
    const newCredential = await passwordStorageModel.create({
        userId:id,
        appName:appName,
        email:email,
        password:encryptedPassword
    });

    await newCredential.save();
    res.status(201).json({status:true,message:"credential added successfully",newCredential:newCredential})
} catch (error) {
    res.status(500).json({status:false,message:"internal server error",error:error.message})
}
}


//  for read password storage
const readPassword = async (req,res)=>{
try {
const id = req.user.id;
    // const data = await passwordStorageModel.find({userId:id}).populate("userId");
     const data = await passwordStorageModel.find({userId:id}).lean();

    //  using map method to show all password into decrypt or plain text

    const decryptPasswordData = data.map((dt)=>{
        const decrypt = CryptoJS.AES.decrypt(dt.password,process.env.PASSWORD_SECRET_KEY).toString(CryptoJS.enc.Utf8);
        
        return {...dt,password:decrypt}
    })

    //  if(data.length <= 0){
    //    return res.status(200).json({status:false,message:"No credential found"})
    //  }

   res.status(200).json({status:false,message:"credential fetched successfully",data:decryptPasswordData})
} catch (error) {
    res.status(500).json({status:false,message:"internal server error",error:error.message,data:data})
}
}

//  for read password storage using by id
const readPasswordById = async (req,res)=>{
try {
const id = req.user.id;
const credentialId = req.params.id
    // const data = await passwordStorageModel.find({userId:id}).populate("userId");
     const data = await passwordStorageModel.findOne({userId:id,_id:credentialId}).lean();

    //  using map method to show all password into decrypt or plain text

    
        const decrypt = CryptoJS.AES.decrypt(data.password,process.env.PASSWORD_SECRET_KEY).toString(CryptoJS.enc.Utf8);
       
        
   

    //  if(data.length <= 0){
    //    return res.status(200).json({status:false,message:"No credential found"})
    //  }

   res.status(200).json({status:false,message:"credential fetched successfully",data:{...data,password:decrypt}})
} catch (error) {
    res.status(500).json({status:false,message:"internal server error",error:error.message,data:data})
}
}

// for delete password storage
const deletePassword = async (req,res)=>{
try {
    // yaha se id nikal rahe hai 
    const userId = req.user.id;
    const credentialId = req.params.id;
    //  for delete
    const deletedResponse = await passwordStorageModel.findOneAndDelete({userId:userId,_id:credentialId})
// validation if credential not founded
    if(!deletedResponse){
       return res.status(404).json({status:false,message:"failed to delete credential not found"})

    }

    return res.status(200).json({status:true,message:"deleted successfully",data:deletedResponse})
   
} catch (error) {
    res.status(500).json({status:false,message:"internal server error",error:error.message})
}
}


// for update password storage
const updatePassword = async (req,res)=>{
try {
    
    const userId = req.user.id;
    const credentialId = req.params.id;

    const {appName,email,password} = req.body
// validation is all filed required
     if(!appName || !email || !password || appName.trim().length <= 0 || email.trim().length <= 0 || password.trim().length <= 0){
        res.status(400).json({status:false,message:"all field required"})
    }

    const isCredentialExist = await passwordStorageModel.exists({_id:credentialId});
// validation is exist or not
    if(!isCredentialExist){
        return res.status(404).json({status:false,message:"credential not exist or not found"})
    }

    // creating hashed or encrypted password 
const encryptedPassword =  CryptoJS.AES.encrypt(password , process.env.PASSWORD_SECRET_KEY).toString();


    // for update
    const updateCredential = await passwordStorageModel.findOneAndUpdate({
        userId:userId,
        _id:credentialId
    },{
        appName:appName,
        email:email,
        password:encryptedPassword
    })

    return res.status(200).json({status:true,message:"updated successfully",updateCredential})


} catch (error) {

    return res.status(500).json({status:false,message:"internal server error",error:error.message})
}
}



export {createPassword , readPassword , readPasswordById , deletePassword , updatePassword}