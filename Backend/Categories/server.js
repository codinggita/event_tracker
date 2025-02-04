import express from 'express';
import dotenv from 'dotenv';
import eventRoutes from "./Routes/Events.js"; // ✅ Default Import
import {connectDB} from "./data/database.js"
import cors from "cors"; // Corrected import
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve('data', 'config.env') });
const app = express();

// Middleware to parse JSON bodies
app.use(cors()); // Enable CORS
app.use(express.json());

connectDB(); // Connect to the database

// Use event routes for API
app.use('/api', eventRoutes);

// Start the server
app.listen(process.env.PORT, () => {
  console.log('Server running on port 5000');
});
