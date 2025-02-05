import { Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../Style/onlyNavbar.css";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSearch(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="navbar-header">
      <nav className={`navbar ${showSearch ? "navbar-expanded" : ""}`}>
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            EventTracker
          </Link>
          <div className={`search-container ${showSearch ? "search-visible" : ""}`}>
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input type="text" placeholder="Search events..." className="search-input" />
            </div>
          </div>
        </div>

        <div className="navbar-right">
          <button className="create-event-btn">Create Event</button>
          <button className="user-icon-btn">
            <User className="user-icon" />
          </button>
        </div>
      </nav>
    </header>
  );
}
