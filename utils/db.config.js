import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

const connnectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to DB");
  } catch (error) {
    console.log(error);
  }
};

export default connnectDB;
