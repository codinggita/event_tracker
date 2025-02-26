import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { BsCalendarEvent, BsGeoAlt,BsX, BsSend } from 'react-icons/bs';
import { BiRupee } from "react-icons/bi"
import api from "../services/api";
import "../Style/EventDetail.css";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase auth import
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

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
  // Firebase user state
  const [user, setUser] = useState(null);
  
  // Firebase auth listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

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
  
    if (!event?.createdByEmail) {
      alert("Host email not found!");
      return;
    }
  
    const emailParams = {
      name: formData.name,
      from_email: user.email, 
      message: formData.message, 
      to_email: event.createdByEmail, 
      reply_to: user.email, 
    };
  
    try {
      await emailjs.send(
        "service_e2nckvu",
        "template_veste8y",
        emailParams,
        "BQ2VzFLCCB-cyp4N_"
      );
  
      alert("Message sent successfully to the event host!");
      setShowQueryForm(false);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      alert("Failed to send message. Please try again.");
    }
  };

  const handleRegister = async () => {
    if (!user) {
      toast.error("Please login to register for this event"); // Use toast.error instead of alert
      return;
    }

    try {
      const response = await api.post("/registerEvent", {
        eventId: id,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email.split('@')[0],
      });

      toast.success(response.data.message); // Use toast.success for success message
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed"); // Use toast.error for error message
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
              < BiRupee className="icon" />
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

          <button className="register-button" onClick={handleRegister}>
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
                <div className="input-with-icon">
                  <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  id="message"
                  placeholder="Message"
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

      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EventDetail;