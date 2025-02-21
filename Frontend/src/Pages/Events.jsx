"use client"

import { useState, useEffect } from "react"
import { FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa"
import "../Style/Events.css"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

const Events = () => {
  const [events, setEvents] = useState([])
  const navigate = useNavigate() 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("allEvents") // No need to pass token manually
        setEvents(response.data)
        toast.success("Events loaded successfully!") // Show success toast
      } catch (error) {
        console.error("Error fetching events:", error)
        toast.error("Failed to load events!")
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
      <h1 className="events-title">Events</h1>
      <div className="events-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <div className="leftSide">
              <div className="event-header">
                <FaClock className="clock-icon" />
                <span className="event-time">{event.time}</span>
                <span className="status-badge">Going</span>
              </div>
              <h2 className="event-title">{event.title}</h2>
              <p className="event-description">{event.shortDescription}</p>
              <div className="event-details">
                <span className="event-creator">
                  <FaUsers className="icon" /> by {event.createdByEmail || "Unknown User"}
                </span>
                <span className="event-location">
                  <FaMapMarkerAlt className="icon" /> {event.location}
                </span>
              </div>
              <button 
                className="manage-button"
                onClick={() => handleViewDetail(event._id)}
              >
                View Detail
              </button>
            </div>
            <div className="rightSide">
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
