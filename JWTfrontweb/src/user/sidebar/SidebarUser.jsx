import React from 'react';
import './sidebarUser.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import concorde_logo from '../../assets/logo/concorde_logo.webp';
import House_01 from '../../assets/icons/House_01.svg';
import Notebook from '../../assets/icons/Notebook.svg?react';
import axios from 'axios';
import { useEffect } from 'react';

const SidebarUser = () => {
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('token');
      console.log(import.meta.env.VITE_API_BASE_URL);

      if (!token) {
        console.warn('No token found, logging out anyway.');
        navigate('/');
        return;
      }

      await axios.post(`${apiUrl}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      sessionStorage.removeItem('token'); // Clear token
      sessionStorage.removeItem('user'); // Clear user data
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/');
    }
  };
  return (
    <div className="sidebarUser">
      <div className="sidebarUser-logo">
        <button onClick={handleLogout}>
            <img src={concorde_logo} className="" alt="main icon" />
        </button>
      </div> {/* sidebarUser-logo */}

      <div className="sidebarUser-buttons">
        <button>
          <Link to="/user/homeUser">
            <img src={House_01} className="" alt="home icon" />
          </Link>
        </button>
      
        <button>
          <Link to="/user/certificateUser">
            <Notebook 
              style={{ 
                color: "var(--primary-color)", 
                width: "32px", 
                height: "32px", 
                "--stroke-width": "4px"  
              }} 
            />
          </Link>
        </button>
      </div> {/* sidebarUser-buttons */}
    </div>
  );
};

export default SidebarUser;