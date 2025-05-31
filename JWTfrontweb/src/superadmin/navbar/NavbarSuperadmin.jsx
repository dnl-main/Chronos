import React from 'react';
import { Link } from 'react-router-dom';
import './navbarsuperadmin.css';
import AccountSuperadmin from '../account/AccountSuperadmin';

import Search from '../../assets/icons/Search.svg';
import Filter from '../../assets/icons/Filter.svg';

import Bell from '../../assets/icons/Bell.svg?react';
import User_Circle from '../../assets/icons/User_Circle.svg?react';


export const NavbarSuperadmin = () => {
  return (
    <nav className="navbar">
      <header className="navbar-header">
        <p>Concorde</p>
      </header> {/* navbar-header */}
        <div className="navbar-main-account">
          <Link to="/superadmin/accountsuperadmin"> 
            <User_Circle 
              style={{ 
                color: "var(--primary-color)", 
                width: "32px", 
                height: "32px", 
                "--stroke-width": "5px"  // ✅ Adjust stroke width dynamically
              }} 
            />
          </Link>
        </div> 
      
    </nav>
  );
};
export default NavbarSuperadmin;