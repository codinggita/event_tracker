"use client";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaCircleUser } from "react-icons/fa6";
import { Search } from "lucide-react";
import { Menu, MenuItem, IconButton, Avatar, Button } from "@mui/material";
import { AuthContext } from "../Context/AuthContext"; // ✅ Corrected import
import axios from "axios";
import toast from "react-hot-toast";
import "../Style/Nav.css";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const logOutHandler = async () => {
    setLoading(true);
    try {
      await axios.get("https://zero1-eventtracker-userauth.onrender.com/api/v1/users/logout", { withCredentials: true });
      toast.success("Logout Successful");
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout Failed");
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
        setShowSearch(true);
      } else {
        setIsScrolled(false);
        setShowSearch(false);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar-header ${isScrolled ? "navbar-scrolled" : ""}`}>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">EventTracker</Link>
          {showSearch && (
            <div className="search-container">
              <div className="search-wrapper">
                <Search className="search-icon" />
                <input type="text" placeholder="Search events..." className="search-input" />
              </div>
            </div>
          )}
        </div>
        <div className="navbar-right">
          {isAuthenticated ? (
            <div className="auth-buttons">
              <Button variant="outlined" className="create-event-btn" onClick={() => navigate("/events")}>
                Events
              </Button>
              <Button variant="outlined" className="create-event-btn" onClick={() => navigate("/createEvent")}>
                Create Event
              </Button>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} className="user-icon-btn">
                <Avatar>R</Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={() => { setAnchorEl(null); navigate("/profile"); }}>Profile</MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
                <MenuItem onClick={() => { setAnchorEl(null); logOutHandler(); }}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                <FaCircleUser className="login-icon" />
                <span>Log in</span>
              </Link>
              <button className="menu-btn"><FaBars /></button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
