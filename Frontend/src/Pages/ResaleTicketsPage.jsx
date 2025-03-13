import { useState, useEffect } from "react";
import { FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import api from "../services/api";
import "../Style/ResaleTicketsPage.css"; // Assuming similar styling to Events.css
import Loader from "../Component/Loader"; // Import Loader

const ResaleTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResaleTickets = async () => {
      try {
        const response = await api.get("/tickets/resale");
        console.log("Raw response:", response);
        if (response.data && Array.isArray(response.data)) {
          const approvedTickets = response.data.filter(
            (ticket) => ticket.resaleStatus === "approved"
          );
          setTickets(approvedTickets);
          if (approvedTickets.length === 0) {
            toast.info("No approved resale tickets available");
          }
        } else {
          toast.error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching resale tickets:", error.response || error);
        toast.error(error.response?.data?.message || "Error fetching resale tickets");
      } finally {
        // Ensure the loader stays visible for at least 3 seconds (like Events.js)
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    };
    fetchResaleTickets();
  }, []);

  const handleViewDetails = (eventId, ticketId, resalePrice) => {
    navigate(`/eventDetail/${eventId}`, {
      state: { ticketId, resalePrice }
    });
  };

  return (
    <div className="events-container"> {/* Reused class from Events.js */}
      <h1 className="events-title">Resale Tickets Marketplace</h1> {/* Updated title */}
      
      <ToastContainer theme="dark" position="top-center" />
      
      {loading ? (
        <Loader /> // Show loader for at least 3 seconds (like Events.js)
      ) : (
        <div className="events-list"> {/* Reused class from Events.js */}
          {tickets.length === 0 ? (
            <div className="empty-state">
              <p>No resale tickets available at the moment.</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket._id} className="event-card"> {/* Reused class */}
                <div className="event-content"> {/* Reused class */}
                  <div className="event-info"> {/* Reused class */}
                    <div className="event-header"> {/* Reused class */}
                      <FaClock className="event-icon1" />
                      <span className="event-time">{ticket.eventId?.time || "Time not specified"}</span>
                      <span className="status-badge">Resale</span> {/* Changed "Going" to "Resale" */}
                    </div>
                    <hr className="divider" />
                    <h2 className="event-title">{ticket.eventId?.title || "Unknown Event"}</h2>
                    <p className="event-description1">{ticket.eventId?.shortDescription || "No description available"}</p>
                    <hr className="divider" />
                    <div className="event-details1"> {/* Reused class */}
                      <span className="event-creator1">
                        <FaUsers className="event-icon1" /> by {ticket.eventId?.createdByEmail || "Unknown User"}
                      </span>
                      <p className="event-location1">
                        <FaMapMarkerAlt className="event-icon1" /> {ticket.eventId?.location || "Location not specified"}
                      </p>
                      <p className="event-price"> {/* Added price */}
                        Price: ₹{ticket.resalePrice || "N/A"}
                      </p>
                    </div>
                    <button
                      className="view-detail-button" // Reused class, comment moved outside
                      onClick={() => handleViewDetails(ticket.eventId?._id, ticket._id, ticket.resalePrice)}
                    >
                      View Details
                    </button>
                    {/* Reused class comment moved here */}
                  </div>
                  <div className="event-image-container"> {/* Reused class */}
                    <img
                      src={ticket.eventId?.imageUrl || "/placeholder.svg"}
                      alt={ticket.eventId?.title}
                      className="event-image" // Reused class
                      onError={(e) => e.target.src = "/placeholder.svg"}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ResaleTicketsPage;