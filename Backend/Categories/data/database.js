import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ⭐ Ye 2 line __dirname banane ke liye ES Modules me
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⭐ Yaha se config.env load karo
dotenv.config({
  path: path.resolve(__dirname, "../config.env"), // "../" = data se bahar jao Categories me
});

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "EventTracker" })
    .then(() => console.log("Database Connected"))
    .catch((e) => console.log("Error in connecting to database: ", e));
};
