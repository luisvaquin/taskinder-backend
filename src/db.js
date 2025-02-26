import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://luisrodrigo2330:admin@clustertaskinn.1zdic.mongodb.net/db_Taskinn"
    );
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
  }
};
