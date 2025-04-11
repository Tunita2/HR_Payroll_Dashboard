import React from 'react';
import '../../styles/GeneralStyles/SearchBar.css';

const SearchBar = ({ onSearch = () => {}, placeholder = "Search" }) => {
  return (
    <div className="search-bar">
        <input className="search-text" type='text' placeholder='Search'></input>
      <img 
        src="https://dashboard.codeparrot.ai/api/image/Z-NkkwzgNnZiU9gN/frame-9.png" 
        alt="search" 
        className="search-icon"
        width={24}
        height={24}
      />
    </div>
  );
};

export default SearchBar;
