import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../services/api";
import "../Style/UserTickets.css";

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      toast.error("Please login to view your tickets");
      navigate("/login");
      return;
    }

    // Fetch user's tickets
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching tickets for user:", user.uid); // Debug log

        const response = await api.get(`/user/tickets/${user.uid}`);
        console.log("Tickets API response:", response.data); // Debug log

        if (response.data.success) {
          setTickets(response.data.tickets || []);
        } else {
          console.error("Server returned error:", response.data.message);
          setError(response.data.message || "Failed to fetch tickets");
          toast.error(response.data.message || "Failed to fetch your tickets");
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setError(error.message || "An unexpected error occurred");
        toast.error("Failed to load your tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Determine if there's an image URL in the event data
  const getImageUrl = (event) => {
    // First try to get the image from the event data
    if (event.imageUrl) return event.imageUrl;

    // Fallback to a placeholder
    return "https://images.unsplash.com/photo-1492684223066-81342ee5ff30";
  };

  // Handle resell button click
  const handleResellClick = (ticketId) => {
    navigate(`/resell-ticket/${ticketId}`);
  };

  if (loading) {
    return <div className="user-tickets-container loading">Loading your tickets...</div>;
  }

  if (error) {
    return (
      <div className="user-tickets-container error">
        <h2 className="page-title">Error</h2>
        <div className="error-message">
          <p>{error}</p>
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-tickets-container">
      <h2 className="page-title">My Tickets</h2>

      {tickets.length === 0 ? (
        <div className="no-tickets">
          <p>You haven't purchased any tickets yet.</p>
          <button
            className="browse-events-btn"
            onClick={() => navigate("/")}
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="tickets-list">
          {tickets.map((ticket) => (
            <div className="ticket-card" key={ticket._id || ticket.paymentId}>
              <div className="ticket-image">
                <img
                  src={getImageUrl(ticket)}
                  alt={ticket.eventTitle}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30";
                  }}
                />
              </div>

              <div className="ticket-header">
                <h3>{ticket.eventTitle}</h3>
                <span className="ticket-date">
                  Purchased on {formatDate(ticket.purchaseDate)}
                </span>
              </div>

              <div className="ticket-details">
                <div className="ticket-info">
                  <span className="info-label">Quantity:</span>
                  <span className="info-value">{ticket.quantity}</span>
                </div>

                <div className="ticket-info">
                  <span className="info-label">Amount Paid:</span>
                  <span className="info-value">₹{ticket.amount}</span>
                </div>

                <div className="ticket-info">
                  <span className="info-label">Payment ID:</span>
                  <span className="info-value">{ticket.paymentId}</span>
                </div>
              </div>

              <div className="ticket-footer">
                <button
                  className="view-event-btn"
                  onClick={() => navigate(`/eventDetail/${ticket.eventId}`)}
                >
                  View Event
                </button>
                <button
                  className="rt-resell-action-btn"
                  onClick={() => handleResellClick(ticket._id)}
                >
                  <span className="rt-resell-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                  </span>
                  Resell Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserTickets;