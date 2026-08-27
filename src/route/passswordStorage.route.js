import express from "express"
import { createPassword, deletePassword, readPassword, readPasswordById, updatePassword } from "../controller/passwordStorage.controller.js";


const passwordStorageRouter = express.Router();


passwordStorageRouter.post("/",createPassword);

passwordStorageRouter.get("/",readPassword);

passwordStorageRouter.get("/:id",readPasswordById);

passwordStorageRouter.delete("/:id",deletePassword);

passwordStorageRouter.put("/:id",updatePassword);


export default passwordStorageRouter