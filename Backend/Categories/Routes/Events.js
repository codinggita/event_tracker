import express from "express";
import { getTrendingEvents ,  getUpcomingEvents } from '../Controllers/Events.js';

const router = express.Router();

// Route to fetch trending events
router.get('/events/trending', getTrendingEvents);

// Route to fetch upcoming events
router.get('/events/upcoming', getUpcomingEvents);

export default router   