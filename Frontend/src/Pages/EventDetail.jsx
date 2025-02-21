import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import emailjs from '@emailjs/browser';
import api from "../services/api";
import "../style/EventDetail.css";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQueryForm, setShowQueryForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching event with ID:", id);
        const response = await api.get(`eventDetail/${id}`);
        console.log("Event data received:", response.data);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError(error.response?.data?.message || "Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetail();
    }
  }, [id]);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    try {
      await emailjs.send(
        'service_e2nckvu',
        'template_veste8y',
        formData,
        'BQ2VzFLCCB-cyp4N_'
      );
      alert('Message sent successfully!');
      setShowQueryForm(false);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  if (loading) {
    return <div className="detail-loading">Loading event details...</div>;
  }

  if (error) {
    return <div className="detail-error">Error: {error}</div>;
  }

  if (!event) {
    return <div className="detail-error">Event not found</div>;
  }

  return (
    <div className="event-detail-page">
      <div className="detail-hero">
        <div className="detail-image-wrapper">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="detail-main-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x400?text=Event+Image';
            }}
          />
          <div className="detail-overlay"></div>
        </div>
        <h1 className="detail-page-title">{event.title}</h1>
      </div>

      <div className="detail-content">
        <div className="detail-main-info">
          <div className="detail-description">
            <h2>About the Event</h2>
            <p className="detail-short-desc">{event.shortDescription}</p>
            <p className="detail-long-desc">{event.longDescription}</p>
          </div>

          <div className="detail-meta">
            <div className="detail-meta-item">
              <i className="icon-calendar"></i>
              <div>
                <h3>Date & Time</h3>
                <p>{event.date}</p>
              </div>
            </div>

            <div className="detail-meta-item">
              <i className="icon-location"></i>
              <div>
                <h3>Location</h3>
                <p>{event.location}</p>
              </div>
            </div>

            <div className="detail-meta-item">
              <i className="icon-price"></i>
              <div>
                <h3>Price</h3>
                <p>₹{event.price}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="detail-host">
            <h2>Event Host</h2>
            <div className="detail-host-info">
              <div className="detail-host-avatar">
                <img 
                  src={event.hostAvatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d'} 
                  alt={event.createdByEmail}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100?text=Host';
                  }}
                />
              </div>
              <div className="detail-host-text">
                <h3>Host</h3>
                <p>{event.createdByEmail}</p>
              </div>
            </div>
          </div>

          <button className="detail-register-btn">Register for Event</button>
          <button className="detail-query-btn" onClick={() => setShowQueryForm(true)}>
            Have a Question?
          </button>
        </div>
      </div>

      <div className="detail-map-section">
        <h2>Event Location</h2>
        <div className="detail-map-box"></div>
      </div>

      {showQueryForm && (
        <div className="detail-query-overlay">
          <div className="detail-query-container">
            <button className="detail-close-btn" onClick={() => setShowQueryForm(false)}>×</button>
            <h2>Send Your Query</h2>
            <form onSubmit={handleQuerySubmit}>
              <div className="detail-form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="detail-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="detail-form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                ></textarea>
              </div>
              <button type="submit" className="detail-submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;