import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import api from "../services/api";
import "../Style/ResellTicketPage.css";

const ResellTicketPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(true); // New state for initial fetch
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setFetchingDetails(true);
        const response = await api.get(`/tickets/${ticketId}`);
        console.log("Ticket details response:", response.data);
        if (response.data && response.data.amount) {
          setOriginalPrice(response.data.amount);
        } else {
          toast.error("Failed to fetch ticket details");
        }
      } catch (error) {
        console.error("Error fetching ticket details:", error.response?.data || error);
        toast.error(error.response?.data?.message || "Error loading ticket details");
      } finally {
        setFetchingDetails(false);
      }
    };
    fetchTicketDetails();
  }, [ticketId]);

  const validatePrice = (value) => {
    const numPrice = Number(value);
    if (!value) {
      setPriceError("Price is required");
    } else if (numPrice <= 0) {
      setPriceError("Price must be greater than 0");
    } else if (originalPrice && numPrice > originalPrice) {
      setPriceError(`Price cannot exceed original price (₹${originalPrice})`);
    } else {
      setPriceError("");
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(value);
    validatePrice(value);
  };

  const handleResell = async (e) => {
    e.preventDefault();
    if (priceError || !price) return;

    try {
      setLoading(true);
      const payload = { resalePrice: Number(price) };
      console.log("Sending payload:", payload);
      const response = await api.post(`/tickets/${ticketId}/resell`, payload);

      if (response.data.message === "Ticket listed for resale and host notified") {
        toast.success("Ticket listed for resale successfully!");
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        toast.error(response.data.message || "Failed to list ticket for resale");
      }
    } catch (error) {
      console.error("Resell error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Error listing ticket for resale");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingDetails) {
    return (
      <div className="rst__page-container">
        <div className="rst__content-wrapper">
          <div className="rst__loading">
            <span className="rst__spinner"></span>
            Loading ticket details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rst__page-container">
      <div className="rst__content-wrapper">
        <div className="rst__card">
          <div className="rst__header">
            <div className="rst__header-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 10h20" />
                <path d="M10 2v4" />
                <path d="M14 2v4" />
                <path d="M10 14l2 2 4-4" />
              </svg>
            </div>
            <div className="rst__header-text">
              <h2 className="rst__title">List Ticket for Resale</h2>
              <p className="rst__subtitle">
                Set your price and list your ticket on the marketplace
                {originalPrice && (
                  <span> (Max: ₹{originalPrice})</span>
                )}
              </p>
            </div>
          </div>

          <div className="rst__card-body">
            <form onSubmit={handleResell} className="rst__form">
              <div className="rst__form-group">
                <h2 htmlFor="price" className="rst__label">Resale Price (₹)</ h2>
                <div className="rst__input-wrapper">
                  <span className="rst__currency-symbol">₹</span>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={handlePriceChange}
                    required
                    min="1"
                    max={originalPrice || undefined}
                    placeholder="Enter resale price"
                    className={`rst__input ${priceError ? "rst__input-error" : ""}`}
                    disabled={originalPrice === null}
                  />
                </div>
                {originalPrice !== null && (
                  <p className="rst__help-text">
                    Enter a price up to ₹{originalPrice}
                  </p>
                )}
                {priceError && (
                  <p className="rst__error-text">{priceError}</p>
                )}
              </div>

              <div className="rst__button-container">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  disabled={loading}
                  className="rst__btn rst__btn-secondary"
                >
                  <span className="rst__btn-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </span>
                  <span>Cancel</span>
                </button>

                <button
                  type="submit"
                  disabled={loading || priceError || !price}
                  className="rst__btn rst__btn-primary"
                >
                  {loading ? (
                    <>
                      <span className="rst__spinner"></span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span className="rst__btn-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h6" />
                          <path d="M16 2v4h4M8 12l3 3 6-6" />
                        </svg>
                      </span>
                      <span>List for Resale</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="rst__info-section">
              <div className="rst__info-header">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <span>Important Information</span>
              </div>
              <ul className="rst__info-list">
                <li>Once listed, your ticket will be visible to other users</li>
                <li>The event organizer will be notified of your listing</li>
                <li>You can cancel your listing at any time before it's sold</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ResellTicketPage;