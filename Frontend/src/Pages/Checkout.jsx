  import { useState, useEffect } from "react";
  import { useLocation, useNavigate } from "react-router-dom";
  import { getAuth } from "firebase/auth";
  import { toast, ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import api from "../services/api";
  import "../Style/Checkout.css"; // Create this CSS file for styling

  const Checkout = () => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();
    
    // Extract event details from location state
    const { eventId, eventTitle, imageUrl, price } = location.state || {};
    const user = auth.currentUser;

    // Load Razorpay script
    useEffect(() => {
      const loadRazorpay = () => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);
      };
      
      loadRazorpay();
      
      return () => {
        // Clean up if needed
      };
    }, []);

    // Check if user is logged in and event details are available
    useEffect(() => {
      if (!user) {
        toast.error("Please login to proceed with checkout.");
        navigate("/login");
        return;
      }
      
      if (!eventId || !eventTitle || !price) {
        toast.error("Event details not found. Please try again.");
        navigate("/");
      }
    }, [user, eventId, eventTitle, price, navigate]);

    const handleQuantityChange = (e) => {
      const value = parseInt(e.target.value);
      setQuantity(value > 0 ? value : 1);
    };

    const handlePayment = async () => {
      if (!user) {
        toast.error("Please login to proceed with checkout.");
        return;
      }

      if (!razorpayLoaded) {
        toast.error("Payment gateway is loading. Please wait a moment.");
        return;
      }

      try {
        setLoading(true);
        
        // Calculate total amount
        const totalAmount = price * quantity;
        
        // Create Razorpay order
        const response = await api.post("/payments/create-order", {
          amount: totalAmount,
        });

        const { orderId, amount, currency } = response.data;

        if (!orderId) {
          throw new Error("Failed to create order");
        }

        // Configure Razorpay options
        const options = {
          key: "rzp_test_UPWp28ZHPoz7nU", // Your Razorpay Key ID
          amount: amount, // Amount in paisa
          currency: currency,
          name: "Event Booking",
          description: `Payment for ${eventTitle} (${quantity} tickets)`,
          order_id: orderId,
          handler: async function (response) {
            try {
              // Verify payment on your server
              await api.post("/payments/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                eventId: eventId,
                userId: user.uid,
                quantity: quantity,
                amount: totalAmount,
                eventTitle: eventTitle  // This was missing!
              });
              
              toast.success("Payment successful! Your tickets are confirmed.");
              
              // Redirect to tickets page instead of home
              setTimeout(() => {
                navigate("/");
              }, 2000);
            } catch (error) {
              console.error("Payment verification failed:", error);
              toast.error("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: user.displayName || "",
            email: user.email || "",
            contact: "", // You can add phone number field if needed
          },
          notes: {
            eventId: eventId,
            userId: user.uid,
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: function() {
              toast.info("Payment cancelled");
              setLoading(false);
            }
          }
        };

        // Initialize Razorpay
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
        
      } catch (error) {
        console.error("Payment error:", error);
        toast.error(error.message || "Payment failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (!eventId || !eventTitle || !price) {
      return <div className="checkout-container">Loading event details...</div>;
    }

    return (
      <div className="checkout-container">
        <div className="checkout-card">
          <h2 className="checkout-title">Checkout</h2>
          
          <div className="event-summary">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt={eventTitle} 
                className="event-thumbnail"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30";
                }}
              />
            )}
            
            <div className="event-info">
              <h3>{eventTitle}</h3>
              <p className="price-tag">₹{price} per ticket</p>
            </div>
          </div>
          
          <div className="quantity-selector">
            <div className="quantity-controls">
              <button 
                type="button" 
                className="quantity-btn"
                onClick={() => setQuantity(prev => prev > 1 ? prev - 1 : 1)}
              >
                -
              </button>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="quantity-input"
              />
              <button 
                type="button"
                className="quantity-btn"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="order-summary">
            <div className="summary-item">
              <span>Price per ticket:</span>
              <span>₹{price}</span>
            </div>
            <div className="summary-item">
              <span>Quantity:</span>
              <span>{quantity}</span>
            </div>
            <div className="summary-item total">
              <span>Total Amount:</span>
              <span>₹{price * quantity}</span>
            </div>
          </div>
          
          <button 
            className="pay-button" 
            onClick={handlePayment}
            disabled={loading || !razorpayLoaded}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
          
          <div className="back-link">
            <button 
              className="back-button" 
              onClick={() => navigate(`/event/${eventId}`)}
            >
              Back to Event
            </button>
          </div>
        </div>
        
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  };

  export default Checkout;