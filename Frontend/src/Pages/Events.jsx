"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa"
import "../Style/Events.css"
import { server } from "../main"

const Events = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${server}/allEvents`)
        setEvents(response.data)
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="events-container">
      <h1 className="events-title">Events</h1>
      <div className="events-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            {/* Event Time & Status */}
  <div className="leftSide">
  <div className="event-header">
              <FaClock className="clock-icon" />
              <span className="event-time">{event.time}</span>
              <span className="status-badge">Going</span>
            </div>

            {/* Event Title & Description */}
            <h2 className="event-title">{event.title}</h2>
            <p className="event-description">{event.shortDescription}</p>

            {/* Creator & Location */}
            <div className="event-details">
              <span className="event-creator">
                <FaUsers className="icon" /> by {event.createdByEmail|| "Unknown User"}
              </span>
              <span className="event-location">
                <FaMapMarkerAlt className="icon" /> {event.location}
              </span>
            </div>

            {/* Manage Button */}
            <button className="manage-button">View</button>
  </div>

          <div className="rightSide">
              {/* Event Image */}
              <div className="event-image-container">
              <img src={event.imageUrl} alt={event.title} className="event-image" />
            </div>
          </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default Events
