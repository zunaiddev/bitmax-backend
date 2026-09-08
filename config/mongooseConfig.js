import mongoose from "mongoose";

async function connectDB() {
    try {
        const connString = process.env.MONGO_URL;
        console.log("Connecting to mongodb...");
        await mongoose.connect(connString);
        console.log('MongoDB Connected Successfully!');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}

export default connectDB;