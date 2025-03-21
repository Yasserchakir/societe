import React from "react";
import "./DashboardAnalytics.css";

const DashboardAnalytics = () => {
  const stats = [
    {
      title: "Sales",
      percentage: "70%",
      amount: "$25,970",
      color: "linear-gradient(135deg, #a44aff, #8b3eff)",
      icon: "📈",
    },
    {
      title: "Revenue",
      percentage: "80%",
      amount: "$14,270",
      color: "linear-gradient(135deg, #ff6b6b, #ff8787)",
      icon: "💰",
    },
    {
      title: "Expenses",
      percentage: "60%",
      amount: "$4,270",
      color: "linear-gradient(135deg, #feca57, #ffcc5c)",
      icon: "💸",
    },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Analytics Overview</h1>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index} style={{ background: stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-percentage">{stat.percentage}</div>
            <div className="stat-amount">{stat.amount}</div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-subtitle">Last 24 hours</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAnalytics;