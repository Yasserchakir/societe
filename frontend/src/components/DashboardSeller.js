import React from 'react'
import Eye from "../assets/eye.gif";
import Checkg from "../assets/check.gif";
import Checkp from "../assets/check.png";
import Moneyp from "../assets/money.png";
import Moneyg from "../assets/money.gif";
import Statsg from "../assets/stats.gif";
import Statsp from "../assets/stats.png";
import Searchg from "../assets/search.gif";
import Searchp from "../assets/search.png";
import Addg from "../assets/add.gif";
import Addp from "../assets/add.png";
import Filterg from "../assets/filter.gif";
import Filterp from "../assets/filter.png";
import Orderg from "../assets/order.gif";
import Orderp from "../assets/order.png";
import EyeStatic from "../assets/eye-static.png";
import LOGO from "../assets/Logo.jpeg"
import ProductList from "./ProductsList";
import AddProduct from "./AddProduct";
import { useState } from 'react';
import ServiceList from './services/ServiceList';
const DashboardSeller = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered1, setIsHovered1] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const [isHovered3, setIsHovered3] = useState(false);
    const [isHovered4, setIsHovered4] = useState(false);
    const [isHovered5, setIsHovered5] = useState(false);
    const [isHovered6, setIsHovered6] = useState(false);
    const [isHovered7, setIsHovered7] = useState(false);
  return (
    
    <div>
      <main>
          <div className="header">
            <div className="left">
              <h1>Dashboard</h1>
              <ul className="breadcrumb">
                <li>
                  <a href="#">Analytics</a>
                </li>
                /
                <li>
                  <a href="#" className="active">
                    Shop
                  </a>
                </li>
              </ul>
            </div>
            <a href="#" className="report">
              <i className="bx bx-cloud-download"></i>
              <span>Download CSV</span>
            </a>
          </div>

          {/* Insights */}
          <ul className="insights">
            <li>
              <i className="bx bx-calendar-check" style={{backgroundColor:"#bbf7d0"}}>
              <img
                  src={isHovered ? Checkg : Checkp}  // Toggle between static and GIF
                  alt="Animated Gif"
                  style={{ width: "50px", height: "auto" }}
                  onMouseEnter={() => setIsHovered(true)}  // Start playing GIF
                  onMouseLeave={() => setIsHovered(false)}  // Stop playing GIF
                />
              </i>

              <span className="info">
                <h3>1,074</h3>
                <p>Paid Orders</p>
              </span>
            </li>
            <li>
              <i className="bx bx-show-alt">
              <img
                  src={isHovered1 ? Eye : EyeStatic}  // Toggle between static and GIF
                  alt="Animated Gif"
                  style={{ width: "50px", height: "auto" }}
                  onMouseEnter={() => setIsHovered1(true)}  // Start playing GIF
                  onMouseLeave={() => setIsHovered1(false)}  // Stop playing GIF
                />
              </i>
              <span className="info">

                <h3>3,944</h3>
                <p>Site Visits</p>

              </span>
            </li>
            <li>
              <i className="bx bx-line-chart" style={{backgroundColor:"#fecdd3"}}>
              <img
                  src={isHovered2 ? Statsg : Statsp}  // Toggle between static and GIF
                  alt="Animated Gif"
                  style={{ width: "50px", height: "auto" }}
                  onMouseEnter={() => setIsHovered2(true)}  // Start playing GIF
                  onMouseLeave={() => setIsHovered2(false)}  // Stop playing GIF
                />
              </i>
              <span className="info">
                <h3>14,721</h3>
                <p>Searches</p>
              </span>
            </li>
            <li>
              <i className="bx bx-dollar-circle" style={{backgroundColor:"#fff2c6"}}>
              <img
                  src={isHovered3 ? Moneyg : Moneyp}  // Toggle between static and GIF
                  alt="Animated Gif"
                  style={{ width: "50px", height: "auto" }}
                  onMouseEnter={() => setIsHovered3(true)}  // Start playing GIF
                  onMouseLeave={() => setIsHovered3(false)}  // Stop playing GIF
                />
              </i>
              <span className="info">
                <h3>$6,742</h3>
                <p>Total Sales</p>
              </span>
            </li>
          </ul>

          {/* Bottom Data */}
          <div className="bottom-data">
            {/* Recent Orders */}
            <div className="orders">
              <div className="header">
                <i className="bx bx-receipt">
                <img
                  src={isHovered4 ? Orderg : Orderp}  // Toggle between static and GIF
                  alt="Animated Gif"
                  style={{ width: "50px", height: "auto" }}
                  onMouseEnter={() => setIsHovered4(true)}  // Start playing GIF
                  onMouseLeave={() => setIsHovered4(false)}  // Stop playing GIF
                />
                </i>
                <h3>Recent Orders</h3>
                <i className="bx bx-filter">
                <img
                  src={isHovered5 ? Filterg : Filterp}  // Toggle between static and GIF
                  alt="Animated Gif"
                  style={{ width: "50px", height: "auto" }}
                  onMouseEnter={() => setIsHovered5(true)}  // Start playing GIF
                  onMouseLeave={() => setIsHovered5(false)}  // Stop playing GIF
                />
                </i>
                <i className="bx bx-search">
                <img
                  src={isHovered6 ? Searchg : Searchp}  // Toggle between static and GIF
                  alt="Animated Gif"
                  style={{ width: "50px", height: "auto" }}
                  onMouseEnter={() => setIsHovered6(true)}  // Start playing GIF
                  onMouseLeave={() => setIsHovered6(false)}  // Stop playing GIF
                />
                </i>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Order Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <img src={LOGO} alt="User" />
                      <p>John Doe</p>
                    </td>
                    <td>14-08-2023</td>
                    <td>
                      <span className="status completed">Completed</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img src={LOGO} alt="User" />
                      <p>John Doe</p>
                    </td>
                    <td>14-08-2023</td>
                    <td>
                      <span className="status pending">Pending</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img src={LOGO} alt="User" />
                      <p>John Doe</p>
                    </td>
                    <td>14-08-2023</td>
                    <td>
                      <span className="status process">Processing</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Reminders */}
            <div className="reminders">
              <div className="header">
                <i className="bx bx-note">
                <img
                  src={isHovered7 ? Addg : Addp}  // Toggle between static and GIF
                  alt="Animated Gif"
                  style={{ width: "50px", height: "auto" }}
                  onMouseEnter={() => setIsHovered7(true)}  // Start playing GIF
                  onMouseLeave={() => setIsHovered7(false)}  // Stop playing GIF
                />
                </i>
                <h3>Reminders</h3>
                <i className="bx bx-filter"></i>
                <i className="bx bx-plus"></i>
              </div>
              <ul className="task-list">
                <li className="completed">
                  <div className="task-title">
                    <i className="bx bx-check-circle"></i>
                    <p>Start Our Meeting</p>
                  </div>
                  <i className="bx bx-dots-vertical-rounded"></i>
                </li>
                <li className="completed">
                  <div className="task-title">
                    <i className="bx bx-check-circle"></i>
                    <p>Analyse Our Site</p>
                  </div>
                  <i className="bx bx-dots-vertical-rounded"></i>
                </li>
                <li className="not-completed">
                  <div className="task-title">
                    <i className="bx bx-x-circle"></i>
                    <p>Play Football</p>
                  </div>
                  <i className="bx bx-dots-vertical-rounded"></i>
                </li>
              </ul>
            </div>
            <AddProduct />
            <ProductList />
          </div>
        </main>
    </div>
  )
}

export default DashboardSeller
