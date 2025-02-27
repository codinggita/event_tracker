import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import "../Style/Home.css";
import api from "../services/api"; // Ensure correct path
import { useNavigate } from "react-router-dom";
import Banner from "../Component/Banner";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import Footer from "../Component/Footer"

import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; 

const Home = () => {

  const [trendingEvents, setTrendingEvents] = useState([]);
  const navigate = useNavigate();

  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);

  const [navbar, setNavbar] = useState(false);

  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY >= 80) {
        setNavbar(true);
      } else {
        setNavbar(false);
      }
    };

    window.addEventListener("scroll", changeBackground);

    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);


  useEffect(() => {
    const fetchTrendingEvents = async () => {
      try {
        const response = await api.get("allEvents"); // Same API as Events.jsx
        setTrendingEvents(response.data.slice(0, 6)); // Show only 6 events
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchTrendingEvents();
  }, []);

  return (
    <>
     <Banner />
      <div className="text-container">
        <div className="header">
          <p>BOUTIQUE ENTERTAINMENT</p>
          <h1 className="header-title">Live music for your special event</h1>
        </div>
        <div className="event-description">
          <p>
            Unplugged Entertainment is founded, owned, and run by professional musicians based in Melbourne. Our mission
            is to provide an exceptional, tailored service that gives wedding couples, corporate clients, and private
            event hosts access to Melbourne's finest live music talent. We're passionate about giving both our clients
            and musicians the professional, personalized experience they deserve.
          </p>
          <br />
          <p>
            Our roster features the very best wedding singers in Melbourne, alongside acoustic duos, trios, and full
            bands who can elevate your special day. Whether you're looking for a solo acoustic performance, hybrid acts,
            or a live DJ with a twist, we have it all. Many of our acoustic duos also offer DJ services, ensuring
            seamless entertainment for your wedding or event.
          </p>
          <br />
          <p>
            We work with Melbourne's top wedding DJs, who can incorporate live elements such as saxophone, vocals,
            percussion, and more to create an unforgettable experience. No matter what type of entertainment you need,
            we are here to make your wedding day or special event truly extraordinary.
          </p>
        </div>
      </div>

      <div className="te-trending-events-container">
  <h2 className="te-section-title">Trending Events</h2>
  <div className="te-events-grid">
    {trendingEvents.map((event) => (
      <div key={event._id} className="te-event-card" onClick={() => navigate(`/eventDetail/${event._id}`)}>
        <div className="te-event-image-wrapper">
          <img 
            src={event.imageUrl || "/placeholder.svg"} 
            alt={event.title} 
            className="te-event-image"
            onError={(e) => e.target.src = "/placeholder.svg"}
          />
          <div className="te-image-overlay"></div>
        </div>
        <div className="te-event-content">
          <h3 className="te-event-title">{event.title}</h3>
          <div className="te-event-info">
            <p className="te-event-location">{event.location}</p>
           <div className="te-flex">
           <div className="te-date">
            <p className="te-event-date">{event.date}</p>
            </div>
            <div className="te-event-price">
              <span className="te-price-icon">💰</span>
              <span className="te-price-amount">₹ {event.price || 'Free'}</span>
            </div>
           </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

<div className="sw-container">
<h1 className="sw-heading">Discover Events in Every Category</h1>
<Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper_container"
      >
        <SwiperSlide  onClick={() => navigate(`/category/Business`)}>
          <img src="https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8QnVzaW5lc3MlMjBDYXRlZ29yeXxlbnwwfHwwfHx8MA%3D%3D" className="sw-img"/>
          <h3 className="sw-text">Business</h3>
        </SwiperSlide>
        <SwiperSlide  onClick={() => navigate(`/category/Technology`)}>
          <img src="https://media.istockphoto.com/id/1979289147/photo/data-analysis-science-and-big-data-with-ai-technology-analyst-or-scientist-uses-a-computer.webp?a=1&b=1&s=612x612&w=0&k=20&c=IIZaVsQl6mMcOPgyPrVm8ZlCSBwKdwWju4TTnM7BM4Q="  className="sw-img" />
          <h3 className="sw-text">Technology</h3>
        </SwiperSlide>
        <SwiperSlide  onClick={() => navigate(`/category/Festival`)}>
          <img src="https://images.pexels.com/photos/904277/pexels-photo-904277.jpeg?auto=compress&cs=tinysrgb&w=600"  className="sw-img"/>
          <h3 className="sw-text">Festival</h3>
        </SwiperSlide>
        <SwiperSlide  onClick={() => navigate(`/category/Music`)}>
          <img src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600"  className="sw-img"/>
          <h3 className="sw-text">Music</h3>
        </SwiperSlide>
        <SwiperSlide  onClick={() => navigate(`/category/Sports`)}>
          <img src="https://images.pexels.com/photos/7005234/pexels-photo-7005234.jpeg?auto=compress&cs=tinysrgb&w=600"  className="sw-img"/>
          <h3 className="sw-text">Sports</h3>
        </SwiperSlide>
        <SwiperSlide  onClick={() => navigate(`/category/Education`)}>
          <img src="https://images.pexels.com/photos/7648221/pexels-photo-7648221.jpeg?auto=compress&cs=tinysrgb&w=600"  className="sw-img"/>
          <h3 className="sw-text">Education</h3>
        </SwiperSlide>
        <SwiperSlide  onClick={() => navigate(`/category/Health`)}>
          <img src="https://images.pexels.com/photos/5890690/pexels-photo-5890690.jpeg?auto=compress&cs=tinysrgb&w=600"  className="sw-img"/>
          <h3 className="sw-text">Health</h3>
        </SwiperSlide>
        <SwiperSlide  onClick={() => navigate(`/category/Arts`)}>
          <img src="https://images.pexels.com/photos/30887772/pexels-photo-30887772/free-photo-of-family-painting-workshop-at-outdoor-market.jpeg?auto=compress&cs=tinysrgb&w=600"  className="sw-img"/>
        <h3 className="sw-text">Arts</h3>
        </SwiperSlide>
        <SwiperSlide  onClick={() => navigate(`/category/Food`)}>
          <img src="https://images.pexels.com/photos/6288729/pexels-photo-6288729.jpeg?auto=compress&cs=tinysrgb&w=600"  className="sw-img"/>
          <h3 className="sw-text">Food</h3>
        </SwiperSlide>

        <div className="slider-controler">
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
</div>

    </>
  );
};

export default Home;
