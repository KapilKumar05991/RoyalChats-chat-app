import mongoose from "mongoose";
import ENV from "../lib/env.js";


async function connectDB() {
    try {
        await mongoose.connect(ENV.MONGODB_URL)
        console.log('MongoDB connected')
    } catch (error) {
        console.error(error);
    }
}

export default connectDB