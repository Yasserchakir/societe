import React from 'react';
import { Link } from 'react-router-dom';

const SideBarClient = () => {
  return (
    <div>
      <div className="sidebar">
        <Link to="/" className="logo">
          <i className="bx bx-code-alt"></i>
          <div className="logo-name">
            <span>Loca</span>Store
          </div>
        </Link>
        <ul className="side-menu">
          <li className="active"> {/* Selected by default */}
            <Link to="/gererprofile">
              <i className="bx bxs-dashboard"></i>Manage Profile Client
            </Link>
          </li>
          <li>
            <Link to="/shop">
              <i className="bx bx-store-alt"></i>Browse Products
            </Link>
          </li>
          <li>
            <Link to="/analytics">
              <i className="bx bx-analyse"></i> My Purchases
            </Link>
          </li>
          <li>
            <Link to="/tickets">
              <i className="bx bx-message-square-dots"></i>Book a Service
            </Link>
          </li>
          <li>
            <Link to="/users">
              <i className="bx bx-group"></i>Help & Support
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <i className="bx bx-cog"></i>Account Settings
            </Link>
          </li>
        </ul>
        <ul className="side-menu">
          <li>
            <Link to="/logout" className="logout">
              <i className="bx bx-log-out-circle"></i>Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBarClient;
