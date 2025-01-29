import express from "express";
import dotenv from "dotenv";
import userRouter from "./Routes/user.js";
import { connectDB } from "./data/database.js";
import cors from "cors"; // Corrected import

dotenv.config(); // Load environment variables

const app = express(); // Initialize Express

app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse JSON

connectDB(); // Connect to the database

// Using Routes
app.use("/api/v1/users", userRouter);

// Start the server
app.listen(4000, () => {
  console.log("Server is working on port 4000");
});
