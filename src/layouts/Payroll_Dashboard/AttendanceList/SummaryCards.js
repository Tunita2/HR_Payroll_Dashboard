import React from "react";
import "./SummaryCards.css";

const SummaryCard = ({ icon, title, value }) => (
  <div className="summary-card-content">
    <img src={icon} alt={title} className="summary-card-icon" />
    <div className="summary-card-text">
      <span className="summary-card-title">{title}</span>
      <span className="summary-card-value">{value}</span>
    </div>
  </div>
);

const Divider = () => <div className="summary-card-divider"></div>;

const SummaryCards = ({ style }) => {
  const cardData = [
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z-S_nwggqYBhYb3I/icon.png",
      title: "Working days",
      value: "22 Days",
    },
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z-S_nwggqYBhYb3I/icon-2.png",
      title: "Work status",
      value: "Absences",
    },
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z-S_nwggqYBhYb3I/icon-3.png",
      title: "Absences",
      value: "3 Days",
    },
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z-S_nwggqYBhYb3I/icon-4.png",
      title: "Leave days",
      value: "2 Day",
    },
  ];

  return (
    <div className="summary-cards-container" style={style}>
      {cardData.map((card, index) => (
        <React.Fragment key={card.title}>
          <SummaryCard {...card} />
          {index < cardData.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </div>
  );
};

SummaryCards.defaultProps = {
  style: {},
};

export default SummaryCards;
