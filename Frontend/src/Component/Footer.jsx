import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import "../Style/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" className="social-icon">
              <FaFacebook size={20} />
            </a>
            <a href="https://twitter.com" className="social-icon">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com" className="social-icon">
              <FaInstagram size={20} />
            </a>
            <a href="https://linkedin.com" className="social-icon">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <MdEmail size={16} />
              <span>rijans.patoliya.cg@gmail.com</span>
            </div>
            <div className="contact-item">
              <MdPhone size={16} />
              <span>+91 8141484841</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {currentYear} Event Management Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;