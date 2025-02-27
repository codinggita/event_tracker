import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { BsCalendarEvent, BsGeoAlt, BsX, BsSend } from "react-icons/bs";
import { BiRupee } from "react-icons/bi";
import api from "../services/api";
import "../Style/EventDetail.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Component/Loader";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQueryForm, setShowQueryForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Firebase user state (optimized)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  // Fetch Event Details (Memoized for Optimization)
  const fetchEventDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`eventDetail/${id}`);
      setEvent(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load event details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchEventDetail();
    }
  }, [id, fetchEventDetail]);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!event?.createdByEmail) {
      alert("Host email not found!");
      return;
    }

    const emailParams = {
      name: formData.name,
      from_email: user?.email,
      message: formData.message,
      to_email: event.createdByEmail,
      reply_to: user?.email,
    };

    try {
      await emailjs.send(
        "service_e2nckvu",
        "template_veste8y",
        emailParams,
        "BQ2VzFLCCB-cyp4N_"
      );

      toast.success("Message sent successfully to the event host!");
      setShowQueryForm(false);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleRegister = async () => {
    if (!user) {
      toast.error("Please login to register for this event");
      return;
    }

    try {
      const response = await api.post("/registerEvent", {
        eventId: id,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email.split("@")[0],
      });

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  // Show Loader when fetching data
  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;
  if (!event) return <div className="error">Event not found</div>;

  return (
    <div className="event-page">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-image-container">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="hero-image"
            loading="lazy" // Optimize Image Loading
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30";
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
              <BiRupee className="icon" />
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
                  src={event.hostAvatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d"}
                  alt={event.createdByEmail}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d";
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

          <button className="query-button" onClick={() => setShowQueryForm(true)}>
            Have a Question?
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EventDetail;
