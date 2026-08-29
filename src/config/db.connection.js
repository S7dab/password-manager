
import mongoose from "mongoose";




async function db_connection() {
    
    try {
        // const url = process.env.MONGO_DB_URL;
        const url = process.env.ATLAS_MONGODB;
        const db = await mongoose.connect(url);
       
        return db
    } catch (error) {
        console.log("error",error.message);
        process.exit(1)
    }
}

export default db_connection