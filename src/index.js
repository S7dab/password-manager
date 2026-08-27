import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db_connection from "./config/db.connection.js";
import userRouter from "./route/user.route.js";
import passwordStorageRouter from "./route/passswordStorage.route.js";
import authMiddleware from "./middleware/authentication.user.js";
import { adminRouter } from "./route/admin.route.js";
import dns from "dns"


dotenv.config();

// changing dns
dns.setServers(["1.1.1.1","8.8.8.8"])


const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/",userRouter)
app.use("/admin",adminRouter)
app.use("/password",authMiddleware,passwordStorageRouter)

app.get("/", (req, res) => {
  res.send("server running successfully");
});

const PORT = process.env.PORT;

db_connection()
  .then((response) => {
    console.log(`db connected on ${response.connection._connectionString}`);
    app.listen(PORT, function () {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`failed to connect db : ${error.message}`);
  });
