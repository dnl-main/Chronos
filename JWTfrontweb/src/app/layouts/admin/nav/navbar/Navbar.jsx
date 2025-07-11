import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

// import Search from '../../assets/icons/Search.svg';
// import Filter from '../../assets/icons/Filter.svg';

// import Bell from '../../assets/icons/Bell.svg?react';
// import User_Circle from '../../assets/icons/User_Circle.svg?react';

import Circle_Primary from '../../../../../assets/icons/Circle_Primary.svg?react';

export const Navbar = () => {
  return (
    <nav className="navbar">
      <header className="navbar-header">
        <p>Concorde</p>
      </header> {/* navbar-header */}

      <main className="navbar-main">
        {/*

        <div className="navbar-main-search">
          <div className="navbar-main-search-left">
            <img src={Search} className="" alt="Search icon" />
            <p>Search</p>
          </div>
          */}
{/*
          <div className="navbar-main-search-right">
            <div className="navbar-main-search-right-bg">
              <img src={Filter} className="" alt="Filter icon" />
            </div> 
          </div> 
        </div> 
        */}

{/* 
        <div className="navbar-main-notification">
          <Link to="/admin/notification">
            
              <Bell 
                style={{ 
                  color: "var(--primary-color)", 
                  width: "32px", 
                  height: "32px", 
                  "--stroke-width": "5px" 
                }} 
              />
          </Link>
        </div> navbar-main-notification */}

        <div className="navbar-main-account">
          <Link to="/admin/account"> 
            {/* <User_Circle 
              style={{ 
                color: "var(--primary-color)", 
                width: "32px", 
                height: "32px", 
                "--stroke-width": "5px"  
              }} 
            /> */}
            <Circle_Primary style={{ width: '20px', height: '20px' }} />
          </Link>
        </div> {/* navbar-main-account */}
      </main> {/* navbar-main */}
    </nav>
  );
};
