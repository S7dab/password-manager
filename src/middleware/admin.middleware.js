import jwt from "jsonwebtoken"



function adminMiddleware(req,res,next){

try {
     const headers = req.headers.authorization;

    if(!headers){
       return res.status(401).json({status:false,message:"Invalid user"})
    }

    const token = headers.split(" ")[1];
    const decode = jwt.verify(token,process.env.JWT_SECRET_KEY)

    if(!decode.isAdmin){
         return res.status(401).json({status:false,message:"Invalid user",error:error.message})
    }
    
    req.user = decode;
    next()
} catch (error) {
    return res.status(401).json({status:false,message:"Invalid user",error:error.message})
}
   
}

export default adminMiddleware