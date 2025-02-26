import { useState, useEffect } from "react";
import { FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import "../Style/Events.css";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const CategoryEvents = () => {
  const { category } = useParams(); // Fixed: Using 'category' to match the route param
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryEvents = async () => {
      try {
        setLoading(true);
        console.log("Fetching events for category:", category);
        const response = await api.get(`/category/${category}`); // Using the correct parameter
        console.log("Response data:", response.data);
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching category events:", error);
        setLoading(false);
      }
    };

    if (category) {
      fetchCategoryEvents();
    }
  }, [category]);

  const handleViewDetail = (eventId) => {
    navigate(`/eventDetail/${eventId}`);
  };

  return (
    <div className="events-container">
      <h1 className="events-title">{category} Events</h1>
      {loading ? (
        <p className="loading">Loading events...</p>
      ) : (
        <div className="events-list">
          {events.length > 0 && !events.message ? (
            events.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-content">
                  <div className="event-info">
                    <div className="event-header">
                      <FaClock className="event-icon" />
                      <span className="event-time">{event.time}</span>
                      <span className="status-badge">Going</span>
                    </div>
                    <hr className="divider" />
                    <h2 className="event-title">{event.title}</h2>
                    <p className="event-description1">{event.shortDescription}</p>
                    <hr className="divider" />
                    <div className="event-details">
                      <span className="event-creator">
                        <FaUsers className="event-icon" /> by {event.createdByEmail || "Unknown User"}
                      </span>
                      <span className="event-location">
                        <FaMapMarkerAlt className="event-icon" /> {event.location}
                      </span>
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
            ))
          ) : (
            <p className="no-events">No events found in this category.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryEvents;