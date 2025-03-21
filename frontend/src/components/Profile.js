import React, { useEffect, useState } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import SideBarClient from './SideBarClient';
import SideBarVendeur from './SideBarVendeur';
import SideBar from "./SideBar";
import DashboardSeller from "./DashboardSeller";
function Profile() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Retrieve user role from localStorage
    const role = localStorage.getItem("role") ? localStorage.getItem("role").trim() : null;

    if (!role) {
      navigate("/login"); // Redirect to login if no role is found
      return;
    }

    setUserRole(role);

    const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');
    sideLinks.forEach(item => {
      const li = item.parentElement;
      item.addEventListener('click', () => {
        sideLinks.forEach(i => i.parentElement.classList.remove('active'));
        li.classList.add('active');
      });
    });

    const menuBar = document.querySelector('.content nav .bx.bx-menu');
    const sideBar = document.querySelector('.sidebar');
    const toggleSidebar = () => sideBar.classList.toggle('close');

    menuBar.addEventListener('click', toggleSidebar);

    const searchBtn = document.querySelector('.content nav form .form-input button');
    const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
    const searchForm = document.querySelector('.content nav form');

    const handleSearchClick = (e) => {
      if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        searchBtnIcon.classList.replace(
          searchForm.classList.contains('show') ? 'bx-search' : 'bx-x',
          searchForm.classList.contains('show') ? 'bx-x' : 'bx-search'
        );
      }
    };

    searchBtn.addEventListener('click', handleSearchClick);

    const handleResize = () => {
      const sideBar = document.querySelector('.sidebar');
      const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
      const searchForm = document.querySelector('.content nav form');
    
      if (!sideBar || !searchBtnIcon || !searchForm) return; // Vérification avant d'utiliser classList
    
      if (window.innerWidth < 768) {
        sideBar.classList.add('close');
      } else {
        sideBar.classList.remove('close');
      }
    
      if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
      }
    };
    

    window.addEventListener('resize', handleResize);

    const toggler = document.getElementById('theme-toggle');
    const handleThemeToggle = () => {
      document.body.classList.toggle('dark', toggler.checked);
    };

    toggler.addEventListener('change', handleThemeToggle);

    return () => {
      menuBar.removeEventListener('click', toggleSidebar);
      searchBtn.removeEventListener('click', handleSearchClick);
      window.removeEventListener('resize', handleResize);
      toggler.removeEventListener('change', handleThemeToggle);
    };
  }, [navigate]);

  // Function to render the correct sidebar based on user role
  const renderSidebar = () => {
    switch (userRole) {
      case "Admin":
        return <SideBar />;
      case "Vendeur":
        return <SideBarVendeur/>;
      case "Client":
        return <SideBarClient />;
      default:
        return null;
    }
  };


  return (
    <div>
      {/* Sidebar based on role */}
      {renderSidebar()}

      {/* Main Content */}
      <div className="content">
        {/* Navbar */}
        <Header />
        <DashboardSeller/>
      </div>
    </div>
  );
}

export default Profile;
