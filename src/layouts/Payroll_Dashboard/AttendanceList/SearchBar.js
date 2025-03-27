import React from "react";
import "./SearchBar.css";

const SearchBar = ({ style }) => {
  return (
    <div className="search-bar" style={style}>
      <div className="search-container">
        <img
          src="https://dashboard.codeparrot.ai/api/image/Z-S_nwggqYBhYb3I/download.png"
          alt="search"
          className="search-icon"
        />
        <input type="text" placeholder="Search....." className="search-input" />
      </div>
    </div>
  );
};

SearchBar.defaultProps = {
  style: {
    width: "100%",
    height: "39px",
    minWidth: "332px",
  },
};

export default SearchBar;
