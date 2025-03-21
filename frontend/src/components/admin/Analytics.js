import React, { useEffect } from 'react';
import './Analytics.css'; // Assuming you have the provided CSS in a separate file
 import friesImage from './fries.jpg';
import pizzaImage from './pizza.jpg';
import cheeseImage from './Cheeseburger.jpg';
 const Analytics = () => {
 
  return (
    <div className="main-content">
      {/* Header */}
      <div className="header">
        <div className="page-title">
          <h1>Dashboard</h1>
          <div className="page-subtitle">Welcome back, John! Here's what's happening today.</div>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <i>🔍</i>
            <input type="text" placeholder="Search..." />
          </div>

          <div className="notification-bell">
            <div className="icon">🔔</div>
            <div className="notification-dot"></div>
          </div>

          <div className="user-profile">
            <div className="avatar">JD</div>
            <div className="user-info">
              <div className="name">John Doe</div>
              <div className="role">Manager</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-title">Total Sales</div>
              <div className="stat-card-value">$12,548</div>
            </div>
            <div className="stat-card-icon sales">💰</div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>▲ 12.5%</span> vs last month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-title">Total Orders</div>
              <div className="stat-card-value">584</div>
            </div>
            <div className="stat-card-icon orders">🛒</div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>▲ 8.2%</span> vs last month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-title">New Customers</div>
              <div className="stat-card-value">129</div>
            </div>
            <div className="stat-card-icon customers">👥</div>
          </div>
          <div className="stat-card-trend trend-up">
            <span>▲ 5.7%</span> vs last month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-title">Avg. Order Value</div>
              <div className="stat-card-value">$21.50</div>
            </div>
            <div className="stat-card-icon revenue">📈</div>
          </div>
          <div className="stat-card-trend trend-down">
            <span>▼ 2.1%</span> vs last month
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Popular Items Section */}
        <div className="popular-items">
          <div className="card-header">
            <div className="card-title">Popular Items</div>
          </div>

          <div className="item-card">
<img src={cheeseImage} alt="Cheese" className="item-image" />
            <div className="item-details">
              <div className="item-name">Double Cheeseburger</div>
              <div className="item-category">Burgers</div>
              <div className="item-price">$8.99</div>
            </div>
            <div className="item-sales">
              <div className="sales-count">142</div>
              <div>Orders</div>
            </div>
          </div>

          <div className="item-card">
<img src={pizzaImage} alt="Burger" className="item-image" />
            <div className="item-details">
              <div className="item-name">Pepperoni Pizza</div>
              <div className="item-category">Pizza</div>
              <div className="item-price">$12.99</div>
            </div>
            <div className="item-sales">
              <div className="sales-count">98</div>
              <div>Orders</div>
            </div>
          </div>

          <div className="item-card">
<img src={friesImage} alt="Burger" className="item-image" />
            <div className="item-details">
              <div className="item-name">Loaded Fries</div>
              <div className="item-category">Sides</div>
              <div className="item-price">$5.49</div>
            </div>
            <div className="item-sales">
              <div className="sales-count">76</div>
              <div>Orders</div>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="recent-orders">
          <div className="card-header">
            <div className="card-title">Recent Orders</div>
          </div>

          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="order-id">#FB2854</td>
                <td>Emily Johnson</td>
                <td>Double Cheeseburger, Fries (L), Soda</td>
                <td>Mar 8, 2025 - 12:42 PM</td>
                <td>$15.97</td>
                <td>
                  <span className="order-status status-completed">Completed</span>
                </td>
              </tr>
              <tr>
                <td className="order-id">#FB2853</td>
                <td>Michael Smith</td>
                <td>Pepperoni Pizza, Buffalo Wings, Garlic Bread</td>
                <td>Mar 8, 2025 - 12:35 PM</td>
                <td>$24.98</td>
                <td>
                  <span className="order-status status-preparing">Preparing</span>
                </td>
              </tr>
              <tr>
                <td className="order-id">#FB2852</td>
                <td>Sarah Williams</td>
                <td>Caesar Salad, Grilled Chicken Wrap</td>
                <td>Mar 8, 2025 - 12:28 PM</td>
                <td>$16.48</td>
                <td>
                  <span className="order-status status-completed">Completed</span>
                </td>
              </tr>
              <tr>
                <td className="order-id">#FB2851</td>
                <td>David Brown</td>
                <td>Fish & Chips, Lemonade</td>
                <td>Mar 8, 2025 - 12:15 PM</td>
                <td>$14.49</td>
                <td>
                  <span className="order-status status-cancelled">Cancelled</span>
                </td>
              </tr>
              <tr>
                <td className="order-id">#FB2850</td>
                <td>Jessica Davis</td>
                <td>Veggie Burger, Sweet Potato Fries, Milkshake</td>
                <td>Mar 8, 2025 - 12:03 PM</td>
                <td>$18.47</td>
                <td>
                  <span className="order-status status-completed">Completed</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="view-more">
            <button className="view-more-btn">View All Orders</button>
          </div>
        </div>
      </div>
     </div>
  );
}

export default Analytics;
