import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import "../style/Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, title, imageUrl, price } = location.state || {};

  const [quantity, setQuantity] = useState(1);

  if (!eventId) {
    toast.error("Invalid event details.");
    navigate("/");
    return null;
  }

  const handlePayment = async () => {
    try {
      const response = await api.post("/payments/create-checkout-session", {
        eventId,
        quantity,
      });

      window.location.href = response.data.url; // Redirect to Stripe Checkout
    } catch (error) {
      toast.error("Payment failed. Try again.");
    }
  };

  return (
    <div className="checkout-page">
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="checkout-container">
        <div className="checkout-card">
          <h2 className="checkout-title">Complete Your Purchase</h2>
          <div className="event-details">
            <div className="image-container">
              <img src={imageUrl} alt={title} className="checkout-image" />
            </div>
            <div className="event-info">
              <h3 className="event-title">{title}</h3>
              <p className="event-price">₹{price} per ticket</p>
            </div>
          </div>
          
          <div className="quantity-selector">
          <label htmlFor="quantity" style={{ marginLeft: "30px" }}>Number of Tickets:</label>
            <div className="quantity-controls">
              <button 
                className="quantity-btn" 
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                <span>-</span>
              </button>
              <input
                id="quantity"
                type="number"
                value={quantity}
                style={{ marginLeft: "30px" }}
                min="1"
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
              <button 
                className="quantity-btn" 
                onClick={() => setQuantity(quantity + 1)}
              >
                <span>+</span>
              </button>
            </div>
          </div>
          
          <div className="checkout-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{price * quantity}</span>
            </div>
            <div className="summary-row">
              <span>Service Fee:</span>
              <span>₹0</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{price * quantity}</span>
            </div>
          </div>
          
          <button className="payment-btn" onClick={handlePayment}>
            <span className="btn-text">Proceed to Payment</span>
            <span className="btn-icon">→</span>
          </button>
          
          <div className="secure-payment">
            <span className="lock-icon">🔒</span>
            <span>Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;