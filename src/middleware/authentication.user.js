import jwt from "jsonwebtoken";

async function authMiddleware(req, res, next) {
  const headers = req.headers.authorization;

  try {
    if (!headers) {
      return res
        .status(401)
        .json({ status: false, message: "authorization headers not found" });
    }
    const token = headers.split(" ")[1];

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

   req.user = decode;

    next();
  } catch (error) {
    return res.status(401).json({status:false,message:"something went wrong",error:error.message})
  }
}

export default authMiddleware;
