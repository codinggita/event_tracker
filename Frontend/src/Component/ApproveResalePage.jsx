import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { auth } from "../Component/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Style/ApproveResalePage.css";

const ApproveResalePage = () => {
  const { ticketId } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const action = query.get("action");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("processing"); // "processing", "success", "error"

  useEffect(() => {
    const handleAction = async () => {
      if (!auth.currentUser) {
        toast.info("Please log in to approve/reject the ticket.");
        navigate(`/login?redirect=/tickets/${ticketId}/approve?action=${action}`);
        return;
      }

      try {
        const response = await api.post(`/tickets/${ticketId}/approve`, { action });
        console.log("API Response:", response.data); // Debug log
        
        // Check if response indicates success (more flexible check)
        if (response.data.message && response.data.message.includes(action)) {
          setStatus("success");
          toast.success(`Ticket ${action}d successfully!`);
          setTimeout(() => navigate("/"), 3000);
        } else {
          setStatus("error");
          toast.error("Failed to process request - unexpected response");
        }
      } catch (error) {
        setStatus("error");
        toast.error(error.response?.data?.message || "Error processing request");
        console.error("Error in approve/reject:", error.response || error);
      } finally {
        setLoading(false);
      }
    };
    
    handleAction();
  }, [ticketId, action, navigate]);

  const capitalizedAction = action ? action.charAt(0).toUpperCase() + action.slice(1) : "";
  
  const getStatusIcon = () => {
    if (loading) {
      return (
        <div className="arp__loading-spinner">
          <div className="arp__spinner"></div>
        </div>
      );
    } else if (status === "success") {
      return (
        <div className="arp__status-icon arp__success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
      );
    } else {
      return (
        <div className="arp__status-icon arp__error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="arp__page-container">
      <div className="arp__content-wrapper">
        <div className="arp__card">
          <div className="arp__status-container">
            {getStatusIcon()}
            
            <h2 className="arp__title">
              {loading ? `Processing ${capitalizedAction} Request` : status === "success" ? 
                `Ticket ${capitalizedAction}d Successfully` : 
                `${capitalizedAction} Request Failed`}
            </h2>
            
            <p className="arp__message">
              {loading ? 
                `Please wait while we ${action} the ticket resale request...` : 
                status === "success" ? 
                  `Your ticket resale has been ${action}d. You will be redirected to the homepage.` : 
                  `We couldn't ${action} the ticket resale. Please try again or contact support.`}
            </p>
            
            {!loading && (
              <div className="arp__button-container">
                <button 
                  onClick={() => navigate("/")} 
                  className="arp__btn arp__btn-primary"
                >
                  <span className="arp__btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </span>
                  <span>Go to Homepage</span>
                </button>
                
                {status === "error" && (
                  <button 
                    onClick={() => window.location.reload()} 
                    className="arp__btn arp__btn-secondary"
                  >
                    <span className="arp__btn-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 4v6h-6"></path>
                        <path d="M1 20v-6h6"></path>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
                        <path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                      </svg>
                    </span>
                    <span>Try Again</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ApproveResalePage;