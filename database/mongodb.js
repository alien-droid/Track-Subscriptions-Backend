import mongoose from "mongoose";

import { MONGO_DB_URI, NODE_ENV } from "../config/env.js";

if (!MONGO_DB_URI) {
  throw new Error("Please set the MONGO_DB_URI environment variable");
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_DB_URI);
    console.log("MongoDB Connected in " + NODE_ENV + " Mode");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;