import express from "express";
import { adminDeleteUser, getAllUserDetails, getUserAllCredential } from "../controller/admin.controller.js";
import adminMiddleware from "../middleware/admin.middleware.js";


const adminRouter = express.Router();


adminRouter.get("/user",adminMiddleware,getAllUserDetails);

adminRouter.delete("/user/:id",adminMiddleware,adminDeleteUser);

adminRouter.get("/user/:id",getUserAllCredential);


export {adminRouter}