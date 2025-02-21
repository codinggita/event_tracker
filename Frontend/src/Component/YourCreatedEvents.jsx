"use client"

import { useState, useEffect } from "react"
import { FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa"
import "../Style/YourCreatedEvents.css"
import api from "../services/api"

const Events = () => {
  const [events, setEvents] = useState([])

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

  return (
    <div className="events-container">
      <h1 className="events-title">Your Events</h1>
      <div className="events-grid">
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
                  <button className="view-button">View Details</button>
                  <button className="manage-button">Manage</button>
                </div>
              </div>

              <div className="rightSide">
                <img 
                  src={event.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"} 
                  alt={event.title || "Event"} 
                  className="event-image" 
                />
              </div>
            </div>
          ))
        ) : (
          <p className="no-events-message">No events found. Create your first event!</p>
        )}
      </div>
    </div>
  )
}

export default Events