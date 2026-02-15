import mongoose from "mongoose";
const mongoURI = process.env.MONGODB_URI

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected`);

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
