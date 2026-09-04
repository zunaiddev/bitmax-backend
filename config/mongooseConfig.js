import mongoose from "mongoose";

async function connectDB() {
    try {
        const connString = 'mongodb://root:pass@localhost:27017/bitmax?authSource=admin';

        console.log("Connecting to mongodb...");
        await mongoose.connect(connString);
        console.log('MongoDB Connected Successfully!');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}

export default connectDB;