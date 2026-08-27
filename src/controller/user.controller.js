import userModel from "../model/user.model.js";
// import jwt
import jwt from "jsonwebtoken";
// import bcrypt
import bcrypt from "bcrypt";

// create user or post controller
const createUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    // checking validation
    if (
      !fullname ||
      !email ||
      !password ||
      fullname.trim().length <= 0 ||
      email.trim().length <= 0 ||
      password.trim().length <= 0
    ) {
      res.status(400).json({ status: false, message: "all fields required" });
    }
    // HASHING password generate
    const generateSalt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, generateSalt);

    //  checking is user already exist or not
    const isUserExist = await userModel.exists({ email: email });
    if (isUserExist) {
      return res
        .status(409)
        .json({ status: false, message: "user already exist" });
    }

    const user = await userModel.create({
      fullname: fullname,
      email: email,
      password: hashedPassword,
    });

    user.save();
    return res
      .status(201)
      .json({ status: true, message: "created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "internal server error",
        error: error.message,
      });
  }
};

// user login controller

const userLogin = async (req, res) => {
  try {
    const { email: email, password: password } = req.body;
    // validation of length if user enter more then 0 charcter
    if (
      !email ||
      !password ||
      email.trim().length <= 0 ||
      password.trim().length <= 0
    ) {
      return res
        .status(400)
        .json({ status: false, message: "all field are required" });
    }

    const user = await userModel.findOne({ email: email });
    // validation of if user email exist or not
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "contained email user not exist" });
    }

    // compare is hashed password equal to plain password
    const plainPassword = bcrypt.compareSync(password, user.password);

    // validation of password is correct or not
    if (!plainPassword) {
      res.status(401).json({ status: false, message: "incorrect password" });
    }

    const userDataPayload = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      isAdmin:user.isAdmin
    };

    const token = jwt.sign(userDataPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    console.log("toke : ", token);

    return res
      .status(200)
      .json({
        status: true,
        message: " Login user successfully",
        user:user,
        token: token
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "internal server error",
        error: error.message,
      });
  }
};

// read user controller

const readUser = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("id", userId);

    const data = await userModel.findById(userId).select("-password");

    return res
      .status(200)
      .json({ status: true, message: "fetched successfully", data: data });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: false,
        message: "internal server error",
        error: error.message,
      });
  }
};


const verifyUserAuthentication = async (req,res) => {
try {
  const header = req.headers.authorization
  if(!header){
    return res.status(401).json({status:false,message:"Header not found"})
  }
  const token = header.split(" ")[1];
  if(!token || token === "null"){
    return res.status(401).json({status:false,message:"token not found"})
  }
  const decode = await jwt.verify(token,process.env.JWT_SECRET_KEY);
  console.log("decode",decode)
  return res.status(200).json({status:true,message:"valid user",data:decode})
} catch (error) {
  console.log(error)
  return res.status(401).json({status:false,message:"invalid user"})
}
}

export { createUser, userLogin, readUser, verifyUserAuthentication };
