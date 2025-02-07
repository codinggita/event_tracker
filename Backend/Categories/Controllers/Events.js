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

// Get Festival Events Controller
export const getFestivalEvents = async (req, res) => {
  try {
    const festivalEvents = await Event.find({ status: "festival" }).sort({ date: 1 }); // Sort by date for festivals
    res.json(festivalEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Business Events Controller
export const getBusinessEvents = async (req, res) => {
  try {
    const businessEvents = await Event.find({ status: "business" }).sort({ date: 1 }); // Sort by date for business events
    res.json(businessEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
