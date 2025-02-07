import express from "express";
import dotenv from "dotenv";
import userRouter from "./Routes/user.js";
import { connectDB } from "./data/database.js";
import cors from "cors"; // Corrected import
import path from 'path';
import cookieParser from "cookie-parser";

dotenv.config({ path: path.resolve('data', 'config.env') });
const app = express(); // Initialize Express

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL (during development)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow necessary HTTP methods
  credentials: true,  // Allow credentials such as cookies or authentication headers
}));

// Middleware
app.use(cookieParser());  // Parse cookies if any are sent
app.use(express.json());   // Parse incoming JSON requests

// Using Routes
app.use("/api/v1/users", userRouter);

connectDB(); // Connect to the database

// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server is working on port 4000");
});
