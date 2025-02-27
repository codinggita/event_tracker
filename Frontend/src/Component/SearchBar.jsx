import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "../Style/SearchBar.css"

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim() !== "") {
            navigate(`/searchResults?q=${searchQuery}`);
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
        <FaSearch onClick={handleSearch} className="search-icone"/>
        </div>
    );
};

export default SearchBar;
