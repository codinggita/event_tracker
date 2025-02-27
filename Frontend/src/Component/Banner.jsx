import React from 'react';
import { Compass, CalendarPlus } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Style/Banner.css"

const Banner = () => {
  const navigate = useNavigate();

  const handleHostEvent = () => {
    const auth = getAuth();
    if (auth.currentUser) {
      navigate("/createEvent");
    } else {
      toast.warn("Please log in to create an event!", { position: "top-center", autoClose: 3000 });
    }
  };

  const handleExploreEvents = () => {
      navigate("/events");
  };

  return (
    <div className="banner">
      <ToastContainer />
      <div className="decorative-line" />
      <div className="banner-content">
        <h1 className="banner-title">
          <span className="text-line">Experience</span>
          <span className="text-line">Unforgettable</span>
          <span className="text-line">Moments</span>
        </h1>
        <p className="subtitle">Where Every Event Tells a Story</p>

        <div className="button-container">
          <button className="banner-button explore" onClick={handleExploreEvents}>
            <span className="button-text">
              <Compass size={24} />
              Discover Events
            </span>
          </button>
          
          <button className="banner-button create" onClick={handleHostEvent}>
            <span className="button-text">
              <CalendarPlus size={24} />
              Host Event
            </span>
          </button>
        </div>
      </div>
      
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
    </div>
  );
};

export default Banner;