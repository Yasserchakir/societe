import React from 'react';
import { Link } from 'react-router-dom'; // Import de Link
const SideBar = () => {
  return (
    <div>
      <div className="sidebar">
        <Link to="/" className="logo"> {/* Utiliser Link ici aussi */}
          <i className="bx bx-code-alt"></i>
          <div className="logo-name">
            <span>Loca</span>Store
          </div>
        </Link>
        <ul className="side-menu">
          <li>
            <Link to="/gererprofile"> {/* Correctement défini */}
              <i className="bx bxs-dashboard"></i>Manage Profile
            </Link>
          </li>
          <li>
            <Link to="/shop">
              <i className="bx bx-store-alt"></i>Shop
            </Link>
          </li>
          <li className="active">
            <Link to="/analytics">
              <i className="bx bx-analyse"></i>Analytics
            </Link>
          </li>
          <li>
            <Link to="/tickets">
              <i className="bx bx-message-square-dots"></i>Tickets
            </Link>
          </li>
          <li>
            <Link to="/users">
              <i className="bx bx-group"></i>Users
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <i className="bx bx-cog"></i>Settings
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

export default SideBar;
