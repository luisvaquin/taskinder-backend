import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost/taskinderdb');
        console.log('Connected to MongoDB');
    } catch (e) {
        console.error(e);
    }
}