  import Event from "../Models/EventCard.js"

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

// ✅ Get single event details
export const getEventDetails = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event details" });
  }
};
