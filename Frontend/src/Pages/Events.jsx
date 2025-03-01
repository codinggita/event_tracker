import { useState, useEffect } from "react";
import { FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import "../Style/Events.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Loader from "../Component/Loader"; // Import Loader

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // State for loader
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("allEvents");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        // Ensure the loader stays visible for at least 3 seconds
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    };

    fetchEvents();
  }, []);

  const handleViewDetail = (eventId) => {
    navigate(`/eventDetail/${eventId}`);
  };

  return (
    <div className="events-container">
      <h1 className="events-title">Events</h1>
      
      {loading ? ( 
        <Loader /> // Show loader for at least 3 seconds
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-content">
                <div className="event-info">
                  <div className="event-header">
                    <FaClock className="event-icon1" />
                    <span className="event-time">{event.time}</span>
                    <span className="status-badge">Going</span>
                  </div>
                  <hr className="divider" />
                  <h2 className="event-title">{event.title}</h2>
                  <p className="event-description1">{event.shortDescription}</p>
                  <hr className="divider" />
                  <div className="event-details1">
                    <span className="event-creator1">
                      <FaUsers className="event-icon1" /> by {event.createdByEmail || "Unknown User"}
                    </span>
                    <p className="event-location1">
                      <FaMapMarkerAlt className="event-icon1" /> {event.location}
                    </p>
                  </div>
                  <button 
                    className="view-detail-button"
                    onClick={() => handleViewDetail(event._id)}
                  >
                    View Detail
                  </button>
                </div>
                <div className="event-image-container">
                  <img 
                    src={event.imageUrl || "/placeholder.svg"} 
                    alt={event.title} 
                    className="event-image"
                    onError={(e) => e.target.src = "/placeholder.svg"} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
