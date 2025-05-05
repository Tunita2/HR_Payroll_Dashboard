import React from 'react';

const SearchForPayroll = ({
  searchQuery,
  setSearchQuery,
  searchCategory,
  setSearchCategory,
  categories,
  placeholder = "Search..."
}) => {
  return (
    <div className="search-container" style={{ margin: "15px 0", display: "flex", gap: "10px" }}>
      {categories && categories.length > 0 && (
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          style={{ padding: "8px", borderRadius: "10px", border: "1px solid #ccc" }}
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ 
          padding: "8px", 
          borderRadius: "10px", 
          border: "1px solid #ccc", 
          width: "250px",
          flex: "1"
        }}
      />
    </div>
  );
};

export default SearchForPayroll;