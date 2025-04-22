import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import '../../styles/GeneralStyles/SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "Search...", className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div 
      className={`search-container ${isFocused ? 'focused' : ''} ${className}`}
    >
      <FaSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {searchTerm && (
        <button 
          className="clear-button" 
          onClick={clearSearch}
          aria-label="Clear search"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
