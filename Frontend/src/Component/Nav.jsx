import React, { useState } from 'react';
import myWebBannerVideo from '../assets/myWeb-banner video.mp4'; // Correct import for video file
import '../Style/Nav.css'; // Import external CSS file
import { FaBars } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";



const Nav = () => {

  const[navbar,setNavbar] = useState(false);
  const navigate = useNavigate();
  
  const changebackground = () => {
    if(window.scrollY>=80){
      setNavbar(true)
    }else{
      setNavbar(false)
    }
    console.log(navbar); 
  }

window.addEventListener('scroll',changebackground)

  return (
    <>
      {/* Video Section below Navbar */}
      <section className="video-section">
        
        {/* Navbar */}
        <nav className={navbar?'navbar active' : 'navbar'}>
          <div className="nav-container">
            <h1 className="logo">EventTracker</h1>
           <div className="user" onClick={() => navigate("/Login")}>
           <FaUserCircle  className='personIcone'/>
           <span>Log in</span>
           </div>
              <FaBars className='menuIcone'/>
          </div>
        </nav>

        {/* Background Video */}
        <video className="background-video" src={myWebBannerVideo} autoPlay muted loop />

        {/* Overlay text */}
        <div className="overlay-text">
          <h2 className="subheading">WEDDING, CORPORATE & PRIVATE ENTERTAINMENT</h2>
          <h1 className="heading">Elevate your event.</h1>
        </div>
      </section>
    </>
  );
};

export default Nav;
