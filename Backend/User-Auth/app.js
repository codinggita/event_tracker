import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./Routes/user.js";
import { connectDB } from "./data/database.js";  // ✅ Import connectDB

dotenv.config();
const app = express();

// ✅ Connect Database
connectDB();  // ✅ Ensure database connection before handling requests

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Routes
app.use("/api/v1/users", userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
