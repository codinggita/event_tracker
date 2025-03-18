import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "../Style/SearchBar.css";

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        const queryParams = new URLSearchParams();

        if (searchQuery.trim()) {
            queryParams.append("q", searchQuery);
        }

        if (location.trim()) {
            queryParams.append("location", location);
        }

        if (queryParams.toString()) {
            navigate(`/searchResults?${queryParams.toString()}`);
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter city or state..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <FaSearch onClick={handleSearch} className="search-icone" />
        </div>
    );
};

export default SearchBar;


