import { Link } from 'react-router-dom';
import './navbarsuperadmin.css';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Search from '../../assets/icons/Search.svg';
import Filter from '../../assets/icons/Filter.svg';

import Bell from '../../assets/icons/Bell.svg?react';
import User_Circle from '../../assets/icons/User_Circle.svg?react';


export const NavbarSuperAdmin = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleLogout = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        await axios.post(
          `${apiUrl}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
          }
        );
      } catch (error) {
        alert('Logout failed: ' + error.message);
      } finally {
        setLoading(false);
        sessionStorage.clear();
        navigate('/login');
      }
    };
  return (
    <nav className="navbar">
      <header className="navbar-header">
        <p>Concorde</p>
      </header>
                  <button
                className="btn-navbar"
                onClick={handleLogout}
                disabled={loading}
              >
                <p>Logout</p>
              </button>
      {/* navbar-header */}
        {/* <div className="navbar-main-account">
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
        </div>  */}
      
    </nav>
  );
};
export default NavbarSuperAdmin;