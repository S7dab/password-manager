
import express from "express"
import { createUser, readUser, userLogin, verifyUserAuthentication } from "../controller/user.controller.js";
import authMiddleware from "../middleware/authentication.user.js";

const userRouter = express.Router();



userRouter.post("/user/signup",createUser)

userRouter.post("/user/login",userLogin)

userRouter.get("/user/read",authMiddleware,readUser)

userRouter.get("/user/verify",verifyUserAuthentication)

export default userRouter