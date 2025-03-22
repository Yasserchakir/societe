import React, { useState } from 'react';
import './Header.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditProfile = () => {
    navigate('/admin/settings');
  };

  return (
    <motion.div 
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-actions">
        <div className="search-box">
          <motion.i 
            className="search-icon"
            whileHover={{ scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            🔍
          </motion.i>
          <input 
            type="text" 
            placeholder="Search..."
            className="search-input"
          />
        </div>

        <motion.div 
          className="notification-bell"
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="icon">🔔</div>
          <div className="notification-dot"></div>
        </motion.div>

        <div className="user-profile-container">
          <motion.div 
            className="user-profile"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={toggleDropdown}
          >
            <div className="avatar">JD</div>
            <div className="user-info">
              <div className="name">John Doe</div>
              <div className="role">Manager</div>
            </div>
          </motion.div>

          <motion.div 
            className={`sub-menu-wrap ${isDropdownOpen ? 'open-menu' : ''}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: isDropdownOpen ? 1 : 0, 
              y: isDropdownOpen ? 0 : -10 
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="sub-menu">
              <div className="user-info">
                <div className="avatar">JD</div>
                <h3>John Doe</h3>
              </div>
              <hr />
              <a onClick={handleEditProfile} className="sub-menu-link">
                <span className="dropdown-icon">👤</span>
                <p>Edit Profile</p>
              </a>
              <a href="#" className="sub-menu-link">
                <span className="dropdown-icon">⚙️</span>
                <p>Settings & Privacy</p>
              </a>
              <a href="#" className="sub-menu-link">
                <span className="dropdown-icon">❓</span>
                <p>Help & Support</p>
              </a>
              <a href="#" className="sub-menu-link logout">
                <span className="dropdown-icon">🚪</span>
                <p>Logout</p>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;