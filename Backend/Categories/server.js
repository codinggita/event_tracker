import express from "express";
import dotenv from "dotenv";
import eventRoutes from "./Routes/Events.js";
import { connectDB } from "./data/database.js";
import cors from "cors";
import path from "path";

// ✅ Load ENV Config
dotenv.config();
dotenv.config({ path: path.resolve('data', 'config.env') });

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

connectDB();
app.use("/api", eventRoutes);

// index.js or app.js
app.listen(process.env.PORT, () => {
  console.log('Server running on port', process.env.PORT);
  // Log all registered routes
});
