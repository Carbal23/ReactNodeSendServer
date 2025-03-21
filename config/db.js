import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv({path: 'variables.env'});

const dbConecction = async ()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("DB conectada")
    } catch (error) {
        console.log("hubo un error", error);
        process.exit(1);
    }
}

export default dbConecction;