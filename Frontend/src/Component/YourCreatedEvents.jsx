import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom" // Add this import
import { FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa"
import "../Style/YourCreatedEvents.css"
import api from "../services/api"

const Events = () => {
  const [events, setEvents] = useState([])
  const navigate = useNavigate() // Add this

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("yourEvents")
        setEvents(response.data || [])
      } catch (error) {
        console.error("Error fetching events:", error)
        setEvents([])
      }
    }

    fetchEvents()
  }, [])

  // Add this function
  const handleViewDetail = (eventId) => {
    navigate(`/eventDetail/${eventId}`)
  }

  return (
    <div className="events-container">
      <h1 className="events-title">Your Events</h1>
      <div className="events-list">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="leftSide">
                <div className="event-header">
                  <FaClock className="clock-icon" />
                  <span className="event-time">{event.time || "No Time"}</span>
                  <span className="status-badge">Going</span>
                </div>
                <h2 className="event-title">{event.title || "Untitled Event"}</h2>
                <p className="event-description">
                  {event.shortDescription || "No Description Available"}
                </p>
                <div className="event-details">
                  <span className="event-creator">
                    <FaUsers className="icon" />
                    {event.createdByEmail || "Unknown User"}
                  </span>
                  <span className="event-location">
                    <FaMapMarkerAlt className="icon" />
                    {event.location || "Unknown Location"}
                  </span>
                </div>
                <div className="button-group">
                  <button 
                    className="view-button"
                    onClick={() => handleViewDetail(event._id)}
                  >
                    View Details
                  </button>
                  <button onClick={() => navigate(`/manage/${event._id}`)}>Manage</button>
                </div>
              </div>
              <div className="rightSide">
                <div className="event-image-container">
                  <img src={event.imageUrl} alt={event.title} className="event-image" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-events">No events found. Create your first event!</div>
        )}
      </div>
    </div>
  )
}

export default Events