import React, { useRef } from "react";
import "../Style/Home.css";
import one from "../assets/arjit.webp";
import two from "../assets/Dj West.avif";
import three from "../assets/Ed sheeran.jpg";
import foure from "../assets/Green-Day.jpg";
import five from "../assets/Izack.avif";
import six from "../assets/Luke.avif";
import seaven from "../assets/shawn Mendes.webp";
import { motion, useScroll, useTransform } from "framer-motion";
// -----------------------------


const Home = () => {
  const targetRef = useRef(null); // Create ref to track scroll position
  const { scrollYProgress } = useScroll({ target: targetRef }); // Get scrollY progress
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]); // Map scroll to horizontal scroll

  return (
    <>
      <div className="text-container">
        <div className="header">
          <p>BOUTIQUE ENTERTAINMENT</p>
          <h1 className="header-title">Live music for your special event</h1>
        </div>
        <div className="event-description">
          <p>
            Unplugged Entertainment is founded, owned, and run by professional
            musicians based in Melbourne. Our mission is to provide an
            exceptional, tailored service that gives wedding couples, corporate
            clients, and private event hosts access to Melbourne’s finest live
            music talent. We’re passionate about giving both our clients and
            musicians the professional, personalized experience they deserve.
          </p>
          <br />
          <p>
            Our roster features the very best wedding singers in Melbourne,
            alongside acoustic duos, trios, and full bands who can elevate your
            special day. Whether you’re looking for a solo acoustic performance,
            hybrid acts, or a live DJ with a twist, we have it all. Many of our
            acoustic duos also offer DJ services, ensuring seamless
            entertainment for your wedding or event.
          </p>
          <br />
          <p>
            We work with Melbourne’s top wedding DJs, who can incorporate live
            elements such as saxophone, vocals, percussion, and more to create an
            unforgettable experience. No matter what type of entertainment you
            need, we are here to make your wedding day or special event truly
            extraordinary.
          </p>
        </div>
      </div>

      <div className="carousel">
        <div className="artist">
          <h1>Artists on tour near Ahmedabad</h1>
        </div>
        <div className="scrollRow" ref={targetRef}> {/* Scroll container */}
          <motion.div className="images" style={{ x }}> {/* Apply horizontal scroll */}
            <div className="imageItem">
              <img src={one} alt="Arjit Singh" />
              <p>Arjit Singh</p>
            </div>
            <div className="imageItem">
              <img src={two} alt="DJ West" />
              <p>DJ West</p>
            </div>
            <div className="imageItem">
              <img src={three} alt="Ed Sheeran" />
              <p>Ed Sheeran</p>
            </div>
            <div className="imageItem">
              <img src={foure} alt="Green Day" />
              <p>Green Day</p>
            </div>
            <div className="imageItem">
              <img src={six} alt="Luke" />
              <p>Luke</p>
            </div>
            <div className="imageItem">
              <img src={seaven} alt="Shawn Mendes" />
              <p>Shawn Mendes</p>
            </div>
            <div className="imageItem">
              <img src={five} alt="Izack" />
              <p>Izack</p>
            </div>
          </motion.div>
        </div>
      </div>

    </>
  );
};

export default Home;