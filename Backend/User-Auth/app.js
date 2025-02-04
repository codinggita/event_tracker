import express from "express";
import dotenv from "dotenv";
import userRouter from "./Routes/user.js";
import { connectDB } from "./data/database.js";
import cors from "cors"; // Corrected import
import path from 'path';

dotenv.config({ path: path.resolve('data', 'config.env') });
const app = express(); // Initialize Express

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173",  // Allow frontend to access the backend
  credentials: true  // Allow cookies and authentication headers
}));
app.use(express.json()); // Middleware to parse JSON

connectDB(); // Connect to the database

// Using Routes
app.use("/api/v1/users", userRouter);

// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server is working on port 4000");
});
