import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../Style/Events.css";
import { useNavigate } from 'react-router-dom';
import { FaRegBookmark, FaStar } from "react-icons/fa";

const Events = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://zero2-event-tracker-categories.onrender.com/api/showEvents");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-container">
      <h1 className='p'>Events</h1>
      <div className='events-grid'>
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <div className="event-image-container">
              <img src={event.imageUrl || "/placeholder.svg"} alt={event.title} className="event-image" />
              <FaRegBookmark className="bookmark-icon" />
            </div>
            <div className="event-details">
              <h2>{event.title}</h2>
              <p>{event.shortDescription}</p>
              <p className="event-location">{event.location}</p>
              <p className="event-date-time">📅 {event.date}</p>
              <div className="event-footer">
                <div className="event-interest">
                  <FaStar className="star-icon" /> 170 Interested
                </div>
                <p className="event-price">💰 INR {event.price}</p>
              </div>

              <button onClick={() => navigate(`/event/${event._id}`)}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
