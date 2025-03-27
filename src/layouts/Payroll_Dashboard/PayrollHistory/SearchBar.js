import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch = () => {} }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar-container">
      <img
        src="https://dashboard.codeparrot.ai/api/image/Z-S4VgggqYBhYb3D/download.png"
        alt="search"
        className="search-icon"
      />
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search....."
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
