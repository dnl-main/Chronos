import React from 'react';
import { Link } from 'react-router-dom';
import './navbarUser.css';

import Search from '../../assets/icons/Search.svg';
import Filter from '../../assets/icons/Filter.svg';

import Bell from '../../assets/icons/Bell.svg?react';
import User_Circle from '../../assets/icons/User_Circle.svg?react';

const NavbarUser = () => {
  return (
    <div className="navbarUser">
      <header className="navbarUser-header">
        <p>Concorde</p>
      </header> {/* navbarUser-header */}
        
      <main className="navbarUser-main">
      
{/*         
        <div className="navbarUser-main-notification">
          <Link to="/user/notificationUser">
            <Bell 
              style={{ 
                color: "var(--primary-color)", 
                width: "32px", 
                height: "32px", 
                "--stroke-width": "5px"  
              }} 
            />
          </Link>
        </div>  */}
        
        <div className="navbarUser-main-account">
          <Link to="/user/accountUser"> 
            <User_Circle 
              style={{ 
                color: "var(--primary-color)", 
                width: "32px", 
                height: "32px", 
                "--stroke-width": "5px"  
              }} 
            />
          </Link>
        </div> {/* navbarUser-main-account */}
      </main> {/* navbarUser-main */}
    </div>
  );
};

export default NavbarUser;