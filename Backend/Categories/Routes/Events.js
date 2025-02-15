import express from "express";
import { createEvents, showEvents, getEventDetails } from '../Controllers/Events.js';

const router = express.Router();

// ✅ Route to create event
router.post("/createEvents", createEvents);
  
// ✅ Route to fetch all events
router.get("/showEvents", showEvents);

// ✅ Route to fetch single event details
router.get("/event/:id", getEventDetails);

export default router;
