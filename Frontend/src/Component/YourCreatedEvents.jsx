import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import "../Style/YourCreatedEvents.css";
import api from "../services/api";

const YourEventCard = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("yourEvents");
        setEvents(response.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  const handleViewDetail = (eventId) => {
    navigate(`/eventDetail/${eventId}`);
  };

  const handleManage = (eventId) => {
    navigate(`/manage/${eventId}`);
  };

  return (
    <div className="your-event-container">
      <h1 className="your-event-title">Your Events</h1>
      <div className="your-event-list">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="your-event-card">
              <div className="your-event-content">
                <div className="your-event-info">
                  <div className="your-event-header">
                    <FaClock className="your-event-icon" style={{ color: '#9370DB' }} /> {/* Purple clock icon */}
                    <span className="your-event-time">{event.time || "No Time"}</span>
                    <span className="your-event-status-badge" style={{ backgroundColor: '#9370DB' }}>Going</span> {/* Purple Going badge */}
                  </div>
                  <h2 className="your-event-title-text">{event.title || "Untitled Event"}</h2>
                  <p className="your-event-description">
                    {event.shortDescription || "No Description Available"}
                  </p>
                  <div className="your-event-details">
                    <span className="your-event-creator">
                      <FaUsers className="your-event-icon"/> 
                      {event.createdByEmail || "Unknown User"}
                    </span>
                    <span className="your-event-location">
                      <FaMapMarkerAlt className="your-event-icon"/> 
                      {event.location || "Unknown Location"}
                    </span>
                  </div>
                  <div className="your-event-button-group">
                    <button 
                      className="your-event-view-detail-button"
                      onClick={() => handleViewDetail(event._id)}
                    >
                      View 
                    </button>
                    <button 
                      className="your-event-manage-button"
                      onClick={() => handleManage(event._id)}
                    >
                      Manage
                    </button>
                  </div>
                </div>
                <div className="your-event-image-container">
                  <img src={event.imageUrl} alt={event.title} className="your-event-image" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="your-event-no-events">No events found. Create your first event!</div>
        )}
      </div>
    </div>
  );
};

export default YourEventCard;