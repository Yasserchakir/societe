import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import './SidebarAdmin.css';

function SidebarAdmin() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMyShopOpen, setIsMyShopOpen] = useState(false);
  const [isFamilyServiceOpen, setIsFamilyServiceOpen] = useState(false);

  const sidebarVariants = {
    open: { width: 250 },
    collapsed: { width: 80 },
  };

  const toggleMyShop = () => setIsMyShopOpen(prev => !prev);
  const toggleFamilyService = () => setIsFamilyServiceOpen(prev => !prev);

  return (
    <motion.div
      className="sidebar"
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'open'}
      variants={sidebarVariants}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="sidebar-brand">
        <i className="bx bxs-store-alt icon"></i>
        {!isCollapsed && <h2>Loca<span>Store</span></h2>}
        <button
          className="menu-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle menu"
        >
          <i className="bx bx-chevron-left icon"></i>
        </button>
      </div>

      <nav className="sidebar-menu">
        <ul>
          {[
            { to: '/admin/dashboardadmin', icon: 'bx-grid-alt', text: 'Dashboard' },
            { to: '/admin/manage-users', icon: 'bx-user', text: 'Users' },
            { to: '/admin/analytics', icon: 'bx-bar-chart', text: 'Analytics' },
            { to: '/admin/reserver', icon: 'bx-calendar-check', text: 'Réservations' },
            { to: '/admin/secteurproduit', icon: 'bx-calendar-check', text: 'Secteur Product' }, 
            { to: '/admin/secteurservice', icon: 'bx-calendar-check', text: 'Secteur Service' }, 

            // Sous-menu MyShop
            <li key="myshop" className="nav-item">
              <div className="nav-link" onClick={toggleMyShop}>
                <i className="bx bx-store icon"></i>
                {!isCollapsed && <span>MyShop</span>}
                {!isCollapsed && (
                  <i
                    className={`bx ${isMyShopOpen ? 'bx-chevron-up' : 'bx-chevron-down'} chevron`}
                  ></i>
                )}
              </div>
              {isMyShopOpen && !isCollapsed && (
                <ul className="nested-menu">
                  <li>
                    <NavLink
                      to="/admin/myproducts"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                      <i className="bx bx-package icon"></i>
                      <span>Products</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/myservices"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                      <i className="bx bx-cog icon"></i>
                      <span>Services</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>,

            // Sous-menu Family Service & Product
            <li key="familyservice" className="nav-item">
              <div className="nav-link" onClick={toggleFamilyService}>
                <i className="bx bx-archive icon"></i>
                {!isCollapsed && <span>Family Service&Product</span>}
                {!isCollapsed && (
                  <i
                    className={`bx ${isFamilyServiceOpen ? 'bx-chevron-up' : 'bx-chevron-down'} chevron`}
                  ></i>
                )}
              </div>
              {isFamilyServiceOpen && !isCollapsed && (
                <ul className="nested-menu">
                  <li>
                    <NavLink
                      to="/admin/familleservice"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                      <i className="bx bx-briefcase icon"></i>
                      <span>Famille Service</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/familleproduit"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                      <i className="bx bx-box icon"></i>
                      <span>Famille Produit</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>,

            { to: '/admin/promotion', icon: 'bx-gift', text: 'Promotions' },
            { to: '/admin/settings', icon: 'bx-slider-alt', text: 'Settings' },
          ].map((item, index) => {
            if (item.to) {
              return (
                <li key={index}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`
                    }
                  >
                    <i className={`bx ${item.icon} icon`}></i>
                    {!isCollapsed && (
                      <>
                        <span>{item.text}</span>
                        {item.badge && <span className="notification-badge">{item.badge}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            } else {
              return item;
            }
          })}
        </ul>
      </nav>
    </motion.div>
  );
}

export default SidebarAdmin;