import { useRef } from "react"
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion"
import "../Style/Home.css"
import { useState, useEffect } from "react"
import myWebBannerVideo from "../assets/myWeb-banner video.mp4"
import { FaBars } from "react-icons/fa"
import { FaUserCircle } from "react-icons/fa"
import one from "../assets/arjit.webp"
import two from "../assets/Dj West.avif"
import three from "../assets/Ed sheeran.jpg"
import four from "../assets/Green-Day.jpg"
import five from "../assets/Izack.avif"
import six from "../assets/Luke.avif"
import seven from "../assets/shawn Mendes.webp"
import trending from "../assets/trendingEvent.avif"
import upcoming from "../assets/upcomingEvent.webp"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
  };

  const navigate = useNavigate();

  const handleRedirect1 = () => {
    navigate("/trending");
  };
  const handleRedirect2 = () => {
    navigate("/upcoming");
  };
  const handleRedirect3 = () => {
    navigate("/festival");
  };
  const handleRedirect4 = () => {
    navigate("/business");
  };

  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"])

  const [navbar, setNavbar] = useState(false)

  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY >= 80) {
        setNavbar(true)
      } else {
        setNavbar(false)
      }
    }

    window.addEventListener("scroll", changeBackground)

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", changeBackground)
    }
  }, []) // Empty dependency array means this effect runs once on mount and cleanup on unmount

    
  return (
    <>

<section className="video-section">
        <nav className={`navbar1 ${navbar ? "active" : ""}`}>
          <div className="nav-container">
            <h1 className="logo">EventTracker</h1>
            <div className="nav-right">
              <div className="user" onClick={() => navigate("/Login")}>
                <FaUserCircle className="personIcone" />
                <span>Log in</span>
              </div>
              <FaBars className="menuIcone" />
            </div>
          </div>
        </nav>

        <video className="background-video" src={myWebBannerVideo} autoPlay muted loop />

        <div className="overlay-text">
          <h2 className="subheading">WEDDING, CORPORATE & PRIVATE ENTERTAINMENT</h2>
          <h1 className="heading">Elevate your event.</h1>
        </div>
      </section>

      <div className="text-container">
        <div className="header">
          <p>BOUTIQUE ENTERTAINMENT</p>
          <h1 className="header-title">Live music for your <br />special event</h1>
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

      <div className="carousel">
        <div className="artist">
          <h1>Artists on tour near Ahmedabad</h1>
        </div>
        <div className="scrollRow" ref={targetRef}>
          <motion.div className="images" style={{ x }}>
            {[
              { src: one },
              { src: two },
              { src: three },
              { src: four },
              { src: six},
              { src: seven },
              { src: five},
            ].map((image, index) => (
              <div key={index} className="imageItem">
                <img src={image.src || "/placeholder.svg"} alt={image.alt} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="allEvents">
      <Slider {...settings}>
        <div className="event-img-container">
          <img src={trending} alt="Trending Event" className="event-image" />
          <div className="text-overlay">
            <h3 className="subheading">THE BEST SINGERS AND MORE!</h3>
            <h1 className="main-heading">Trending Events</h1>
            <button className="cta-button"  onClick={handleRedirect1}> →</button>
          </div>
        </div>
        
        <div className="event-img-container">
          <img src={upcoming} alt="Upcoming Event" className="event-image" />
          <div className="text-overlay">
            <h3 className="subheading">THE BEST WEDDING SINGERS AND MORE!</h3>
            <h1 className="main-heading">Upcoming Events</h1>
            <button className="cta-button"  onClick={handleRedirect2}> →</button>
          </div>
        </div>
        
        <div className="event-img-container">
          <img src="https://img.freepik.com/premium-photo/photo-india-culture_195643-10592.jpg?ga=GA1.1.473259152.1738574036&semt=ais_incoming" alt="Festival Event" className="event-image" />
          <div className="text-overlay">
            <h3 className="subheading">THE BEST WEDDING SINGERS AND MORE!</h3>
            <h1 className="main-heading">Festival Events</h1>
            <button className="cta-button"  onClick={handleRedirect3}> →</button>
          </div>
        </div>

        <div className="event-img-container">
          <img src="https://img.freepik.com/premium-photo/man-stands-podium-delivers-impressive-business-presentation-speech-audience_449728-18158.jpg?ga=GA1.1.473259152.1738574036&semt=ais_incoming" alt="Festival Event" className="event-image" />
          <div className="text-overlay">
            <h3 className="subheading">THE BEST WEDDING SINGERS AND MORE!</h3>
            <h1 className="main-heading">Business Events</h1>
            <button className="cta-button"  onClick={handleRedirect4}> →</button>
          </div>
        </div>
      </Slider>
    </div>

    <div className="box">
      j
    </div>
    </>
  )
}

export default Home

