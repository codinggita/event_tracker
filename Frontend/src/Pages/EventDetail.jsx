import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { BsCalendarEvent, BsGeoAlt, BsCurrencyDollar, BsX, BsSend, BsPerson } from 'react-icons/bs';
import api from "../services/api";
import "../Style/EventDetail.css";

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
        const response = await api.get(`eventDetail/${id}`);
        setEvent(response.data);
      } catch (error) {
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
      alert('Failed to send message. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!event) {
    return <div className="error">Event not found</div>;
  }

  return (
    <div className="event-page">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-image-container">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="hero-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30';
            }}
          />
          <div className="hero-overlay"></div>
        </div>
        <h1 className="hero-title">{event.title}</h1>
      </div>

      {/* Content Section */}
      <div className="content-wrapper">
        {/* Main Content */}
        <div className="main-content">
          <div className="about-section">
            <h2>About the Event</h2>
            <p className="short-description">{event.shortDescription}</p>
            <p className="long-description">{event.longDescription}</p>
          </div>

          {/* Event Details Grid */}
          <div className="details-grid">
            <div className="detail-card">
              <BsCalendarEvent className="icon" />
              <div className="detail-info">
                <h3>Date & Time</h3>
                <p>{event.date}</p>
              </div>
            </div>

            <div className="detail-card">
              <BsGeoAlt className="icon" />
              <div className="detail-info">
                <h3>Location</h3>
                <p>{event.location}</p>
              </div>
            </div>

            <div className="detail-card">
              <BsCurrencyDollar className="icon" />
              <div className="detail-info">
                <h3>Price</h3>
                <p>₹{event.price}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="host-card">
            <h2>Event Host</h2>
            <div className="host-info">
              <div className="host-avatar">
                <img 
                  src={event.hostAvatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d'} 
                  alt={event.createdByEmail}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d';
                  }}
                />
              </div>
              <div>
                <h3>{event.createdByEmail}</h3>
                <p>Host</p>
              </div>
            </div>
          </div>

          <button className="register-button">
            Register for Event
          </button>

          <button 
            className="query-button"
            onClick={() => setShowQueryForm(true)}
          >
            Have a Question?
          </button>
        </div>
      </div>

      {/* Query Form Modal */}
      {showQueryForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-button"
              onClick={() => setShowQueryForm(false)}
            >
              <BsX size={24} />
            </button>

            <h2>Send Your Query</h2>

            <form onSubmit={handleQuerySubmit} className="query-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <div className="input-with-icon">
                  <BsPerson className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-button">
                <BsSend className="icon" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;