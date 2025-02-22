"use client";

import { useState, useEffect } from "react";
import { FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import "../Style/Events.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("allEvents"); // No need to pass token manually
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
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
      <div className="events-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <div className="event-content">
              <div className="event-info">
                <div className="event-header">
                  <FaClock className="event-icon" />
                  <span className="event-time">{event.time}</span>
                  <span className="status-badge">Going</span>
                </div>
                <hr className="divider" /> {/* First Divider */}
                <h2 className="event-title">{event.title}</h2>
                <p className="event-description1">{event.shortDescription}</p>
                <hr className="divider" /> {/* Second Divider */}
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
                <img src={event.imageUrl} alt={event.title} className="event-image" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;