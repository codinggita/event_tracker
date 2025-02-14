import Event from "../Models/EventCard.js"

// Get Trending Events Controller
export const getTrendingEvents = async (req, res) => {
  try {
    const trendingEvents = await Event.find({ status: "trending" }).sort({ trendingScore: -1 });
    res.json(trendingEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

  // Get Upcoming Events Controller
export const getUpcomingEvents = async (req, res) => {
  try {
    const upcomingEvents = await Event.find({ status: "upcoming" }).sort({ date: 1 });
    res.json(upcomingEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//create events
export const createEvents =  async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json({ message: "Event Created", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Error Creating Event" });
  }
}

//show Events
export const showEvents =  async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Events" });
  }
}

