// Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { motion } from 'framer-motion';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer la dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Variantes d'animation pour la dropdown
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div 
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-title">
        <h1>Dashboard</h1>
        <div className="page-subtitle">Welcome back, John! Here's what's happening today.</div>
      </div>

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

        <div className="user-profile-container" ref={dropdownRef}>
          <motion.div 
            className="user-profile"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="avatar">JD</div>
            <div className="user-info">
              <div className="name">John Doe</div>
              <div className="role">Manager</div>
            </div>
          </motion.div>

          {isDropdownOpen && (
            <motion.div
              className="dropdown-menu"
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="dropdown-item">
                <i className="dropdown-icon">👤</i> Profile
              </div>
              <div className="dropdown-item">
                <i className="dropdown-icon">⚙️</i> Settings
              </div>
              <div className="dropdown-item">
                <i className="dropdown-icon">💰</i> Billing
              </div>
              <div className="dropdown-item logout">
                <i className="dropdown-icon">🚪</i> Logout
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Header;