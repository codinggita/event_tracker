import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/EventsCard.css';

export default function TrendingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://eventtracker-categories.onrender.com/api/events/festival');
        setEvents(response.data);
      } catch (err) {
        setError('Error fetching events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="trending-section">
      <h2>Festival Events</h2>
      <div className="events-container">
        {events.map((event) => (
          <div className="event-card" key={event._id}>
            <div className="image-container">
              <img src={event.image} alt={event.title} />
              <button className="bookmark-btn">★</button>
            </div>
            <div className="card-content">
              <h3>{event.title}</h3>
              <p className="description">{event.description}</p>
              <p className="venue">{event.location}</p>
              <div className="card-footer">
                <div className="event-info">
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  <span className="dot">•</span>
                  <span className="interested">95 Interested</span>
                </div>
                <div className="price">INR {event.price || "1000"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}