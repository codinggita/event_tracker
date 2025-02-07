import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "EventTracker" })
    .then(() => console.log("Database Connected"))
    .catch((e) => console.log("Error in connecting to database: ", e));
};
