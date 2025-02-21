import React, { useEffect, useState } from 'react';
import { Compass, CalendarPlus } from 'lucide-react';
import '../Style/Banner.css';
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Banner = () => {
  const [text, setText] = useState('');
  const fullText = 'Experience\nUnforgettable\nMoments';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isErasing) {
        if (currentIndex < fullText.length) {
          setText(prev => prev + fullText[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        } else {
          setTimeout(() => {
            setIsErasing(true);
            setCurrentIndex(fullText.length - 1);
          }, 1000);
        }
      } else {
        if (currentIndex >= 0) {
          setText(prev => prev.slice(0, -1));
          setCurrentIndex(prev => prev - 1);
        } else {
          setIsErasing(false);
          setCurrentIndex(0);
        }
      }
    }, isErasing ? 100 : 150);

    return () => clearTimeout(timeout);
  }, [currentIndex, isErasing]);

  const handleHostEvent = () => {
    const auth = getAuth();
    if (auth.currentUser) {
      navigate("/createEvent");
    } else {
      toast.warn("Please log in to create an event!", { position: "top-center", autoClose: 3000 });
    }
  };

  const handleExploreEvents = () => {
    const auth = getAuth();
    if (auth.currentUser) {
      navigate("/events");
    } else {
      toast.warn("Please log in to explore an event!", { position: "top-center", autoClose: 3000 });
    }
  };
  

  const formattedText = text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < 2 && <br />}
    </React.Fragment>
  ));

  return (
    <div className="banner">
      <ToastContainer />  {/* 🔥 Ye component add kiya hai */}
      <div className="decorative-line" />
      <div className="banner-content">
        <h1 className="typing-text">
          {formattedText}
          <span className="cursor" />
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
