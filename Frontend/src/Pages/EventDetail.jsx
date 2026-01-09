import { useEffect, useState, Suspense ,useRef} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { BsCalendarEvent, BsGeoAlt, BsX, BsSend } from "react-icons/bs";
import { BiRupee } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import api from "../services/api";
import "../Style/EventDetail.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Component/Loader";

// Separate component for the query form modal to reduce initial bundle size
const QueryFormModal = ({ showQueryForm, setShowQueryForm, formData, setFormData, handleQuerySubmit }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="close-button" onClick={() => setShowQueryForm(false)}>
        <BsX size={24} />
      </button>

      <h2>Send Your Query</h2>

      <form onSubmit={handleQuerySubmit} className="query-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <textarea
            placeholder="Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
);

// Separate component for event details to enable better performance
const EventDetails = ({ event, effectivePrice, handleRegister, handleCheckout, setShowQueryForm }) => (
  <>
    <div className="hero">
      <div className="hero-image-container">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="hero-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30";
          }}
        />
        <div className="hero-overlay"></div>
      </div>
      <h1 className="hero-title">{event.title}</h1>
    </div>

    <div className="content-wrapper">
      <div className="main-content">
        <div className="about-section">
          <h2>About the Event</h2>
          <p className="short-description">{event.shortDescription}</p>
          <p className="long-description">{event.longDescription}</p>
        </div>

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
              <p>₹{effectivePrice}</p>
            </div>
          </div>
        </div>
      </div>

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

        <button className="checkout-button" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  </>
);

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

  const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Added for accessing resalePrice and ticketId
  const { resalePrice, ticketId } = location.state || {}; // Extract resalePrice and ticketId from navigation state

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`eventDetail/${id}`);
        if (isMounted) {
          setEvent(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.response?.data?.message || "Failed to load event details");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchEventDetail();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

    // Close sort dropdown on outside click
  useEffect(() => {
    const onClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/events/${id}/reviews`, { params: { sort: sortBy } });
        setReviews(response.data.reviews || []);
        setAverageRating(Number(response.data.averageRating || 0));
        setRatingCount(Number(response.data.ratingCount || 0));
      } catch (fetchError) {
        console.error("Failed to load reviews", fetchError);
      }
    };
    fetchReviews();
  }, [id, sortBy]);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    if (!event?.createdByEmail) {
      toast.error("Host email not found!");
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

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to proceed with checkout.");
      return;
    }
  
    // Updated to handle both normal and resale tickets
    navigate("/checkout", {
      state: {
        eventId: id,
        eventTitle: event.title,
        imageUrl: event.imageUrl,
        price: resalePrice || event.price, // Use resalePrice if available, else event.price
        ticketId: ticketId || undefined, // Pass ticketId for resale purchase
      },
    });
  };

  // Updated to use resalePrice if available
  const effectivePrice = resalePrice || (event ? event.price : "N/A");

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to leave a review");
      return;
    }

    if (!rating) {
      toast.error("Select a rating between 1 and 5 stars");
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post(`/events/${id}/reviews`, { rating, comment });
      const listResponse = await api.get(`/events/${id}/reviews`, { params: { sort: sortBy } });
      setReviews(listResponse.data.reviews || []);
      setAverageRating(Number(listResponse.data.averageRating || 0));
      setRatingCount(Number(listResponse.data.ratingCount || 0));
      setComment("");
      toast.success("Review submitted");
    } catch (submitError) {
      console.error("Review submit error", submitError);
      toast.error(submitError.response?.data?.message || "Could not submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (value) =>
    [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`star-button ${value >= star ? "filled" : ""}`}
        onClick={() => setRating(star)}
        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
      >
        <FaStar />
      </button>
    ));


  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!event) {
    return <div className="error">Event not found</div>;
  }

  return (
    <div className="event-page">
      <Suspense fallback={<Loader />}>
        <EventDetails 
          event={event}
          effectivePrice={effectivePrice}
          handleRegister={handleRegister}
          handleCheckout={handleCheckout}
          setShowQueryForm={setShowQueryForm}
        />

        <section className="reviews-section">
          <div className="reviews-header">
            <div>
              <h2>Event Reviews</h2>
              <div className="rating-summary">
                <span className="rating-score">{averageRating.toFixed(1)}</span>
                <div className="rating-stars static-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className={averageRating >= star ? "filled" : ""} />
                  ))}
                </div>
                <span className="rating-count">{ratingCount} review{ratingCount === 1 ? "" : "s"}</span>
              </div>
            </div>
            <div className="review-sort">
              <div className="sort-dropdown" ref={sortRef}>
                <button
                  type="button"
                  className="sort-toggle"
                  onClick={() => setIsSortOpen((v) => !v)}
                  aria-expanded={isSortOpen}
                  aria-haspopup="listbox"
                >
                  {sortBy === "newest" ? "Newest" : "Most Rated"}
                  <span className={`chev ${isSortOpen ? "open" : ""}`}>▾</span>
                </button>
                {isSortOpen && (
                  <div className="sort-menu" role="listbox" aria-label="Sort reviews">
                    <button
                      className={`sort-option ${sortBy === "newest" ? "selected" : ""}`}
                      role="option"
                      aria-selected={sortBy === "newest"}
                      onClick={() => {
                        setSortBy("newest");
                        setIsSortOpen(false);
                      }}
                    >
                      Newest
                    </button>
                    <button
                      className={`sort-option ${sortBy === "highest" ? "selected" : ""}`}
                      role="option"
                      aria-selected={sortBy === "highest"}
                      onClick={() => {
                        setSortBy("highest");
                        setIsSortOpen(false);
                      }}
                    >
                      Most Rated
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="review-form-card">
            <h3>Leave a review</h3>
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="rating-input">
                <span>Your rating</span>
                <div className="rating-stars">{renderStars(rating)}</div>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience"
                rows={4}
              />
              <button type="submit" className="submit-review" disabled={submittingReview}>
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to share your thoughts!</p>
            ) : (
              reviews.map((item) => (
                <div key={item._id} className="review-card">
                  <div className="review-card-header">
                    <div className="reviewer-info">
                      <div className="avatar-circle">{item.userName?.[0]?.toUpperCase() || "U"}</div>
                      <div>
                        <p className="reviewer-name">{item.userName || "Guest"}</p>
                        <p className="review-date">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="rating-stars static-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className={item.rating >= star ? "filled" : ""} />
                      ))}
                    </div>
                  </div>
                  {item.comment && <p className="review-text">{item.comment}</p>}
                </div>
              ))
            )}
          </div>
        </section>
        
        {showQueryForm && (
          <QueryFormModal
            showQueryForm={showQueryForm}
            setShowQueryForm={setShowQueryForm}
            formData={formData}
            setFormData={setFormData}
            handleQuerySubmit={handleQuerySubmit}
          />
        )}
      </Suspense>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EventDetail;