import express from "express";
import { getTrendingEvents ,  getUpcomingEvents , getFestivalEvents , getBusinessEvents} from '../Controllers/Events.js';

const router = express.Router();

// Route to fetch trending events
router.get('/events/trending', getTrendingEvents);

// Route to fetch upcoming events
router.get('/events/upcoming', getUpcomingEvents);

// Route to fetch upcoming events
router.get('/events/festival', getFestivalEvents);

// Route to fetch upcoming events
router.get('/events/business', getBusinessEvents);

export default router 