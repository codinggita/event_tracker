import express from "express";
import { getTrendingEvents ,  getUpcomingEvents , createEvents , showEvents} from '../Controllers/Events.js';

const router = express.Router();

// Route to fetch trending events
router.get('/events/trending', getTrendingEvents);

// Route to fetch upcoming events
router.get('/events/upcoming', getUpcomingEvents);

// route to create event
app.post("/createEvents", createEvents);
  
// Route to fetch events
app.get("/showEvents", showEvents);
  

export default router 