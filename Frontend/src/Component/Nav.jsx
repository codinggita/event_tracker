import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
import { Compass } from "lucide-react";
import { auth } from "../Component/firebase"; // Import Firebase auth
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../Style/Nav.css";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState(null); // Firebase user state
  const navigate = useNavigate();
  let lastScrollY = window.scrollY;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setIsScrolled(window.scrollY > 50);
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <header
      className={`navbar-header ${isScrolled ? "navbar-scrolled" : ""} ${
        isVisible ? "navbar-visible" : "navbar-hidden"
      }`}
    >
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <Compass className="logo-icon" />
            <span className="logo-text">EventTracker</span>
          </Link>
        </div>

        <div className="navbar-right">
          {user ? (
            <div className="auth-buttons">
              <button className="nav-button events-btn" onClick={() => navigate("/events")}>
                Events
              </button>
              <button className="nav-button logout-btn" onClick={handleLogout}>
                Log Out
              </button>
              <div className="avatar-container">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5F6_OcqlG2OXpJE4z0MIvFHloB-J5K1pwbA&s"
                  alt="User Avatar"
                  className="user-avatar"
                  onClick={() => navigate("/profile")}
                />
                <div className="avatar-ring"></div>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="nav-button login-btn" onClick={() => navigate("/login")}>
                Log In
              </button>
              <button className="menu-btn">
                <FaBars />
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
