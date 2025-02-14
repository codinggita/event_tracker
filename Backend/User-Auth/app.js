import express from "express";
import dotenv from "dotenv";
import userRouter from "./Routes/user.js";
import { connectDB } from "./data/database.js";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config({ path: path.resolve('data', 'config.env') });
const app = express();

// ✅ Fix: Proper CORS settings to allow cookies
app.use(cors({
  origin: "http://localhost:5173",  // ✅ Frontend URL
  credentials: true,                 // ✅ Allow cookies to be sent
}));

// ✅ Middleware
app.use(cookieParser());  
app.use(express.json());

// ✅ Routes
app.use("/api/v1/users", userRouter);

// ✅ Connect Database
connectDB();

// ✅ Start Server
app.listen(process.env.PORT, () => {
  console.log("Server is working on port 4000");
});
