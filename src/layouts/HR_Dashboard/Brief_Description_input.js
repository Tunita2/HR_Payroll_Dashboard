import React, { useState } from 'react';
import './Brief_Description_input.css';

const BriefDescriptionSection = ({ initialDescription = "........." }) => {
  const [description, setDescription] = useState(initialDescription);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div className="brief-description-container">
      <div className="brief-description-content">
        <div className="title-section">
          <img src="https://dashboard.codeparrot.ai/api/image/Z-kTVgz4-w8v6RmM/pencil.png" alt="Edit" className="edit-icon" onClick={handleEdit} />
          <h2 className="section-title">Brief Description</h2>
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={description}
            onChange={handleChange}
            onBlur={handleBlur}
            className="description-input"
            autoFocus
          />
        ) : (
          <div className="description-display">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export default BriefDescriptionSection;

