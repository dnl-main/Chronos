import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';
import House_01 from '../../assets/icons/House_01.svg';


import Calendar from '../../assets/icons/Calendar.svg';
import concorde_logo from '../../assets/logo/concorde_logo.webp';

import Users from '../../assets/icons/Users.svg?react';
import Notebook from '../../assets/icons/Notebook.svg?react';
import Book from '../../assets/icons/Book.svg?react';



const Sidebar = () => {
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.warn('No token found, logging out anyway.');
        navigate('/login');
        return;
      }

      await axios.post(`${apiUrl}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem('token'); // Clear token
      localStorage.removeItem('user'); // Clear user data
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };
  return (
  <div className="sidebar">
    <div className="sidebar-logo">
      
      <Link to="/">
        <button onClick={handleLogout}>
          <img src={concorde_logo} className="" alt="Search icon" />
        </button>
      </Link>
    </div> {/* sidebar-logo */}

    <div className="sidebar-buttons">
      <Link to="/home">
        <button>
          <img src={House_01} className="" alt="home icon" />
        </button>
      </Link>

      
      <Link to="/availability">
        <button>
          <Users style={{ width: "32px", height: "32px", color: "#00889a", strokeWidth: 2 }} />
        </button>
      </Link>
      
      <Link to="/calendar">
        <button>
          <img src={Calendar} className="" alt="calendar icon" />
        </button>
      </Link>
      
      <Link to="/certificate">
      <button>
        <Notebook 
          style={{ 
            color: "var(--primary-color)", 
            width: "32px", 
            height: "32px", 
            "--stroke-width": "4px"  // ✅ Adjust stroke width dynamically
          }} 
        />
        </button>
      </Link>

      <Link to="/schedule">
        <button>  
          <Book 
            style={{ 
              color: "var(--primary-color)", 
              width: "32px", 
              height: "32px", 
              '--stroke-width': '4px' // Set the stroke width here
            }} 
          />
        </button>
      </Link>
    </div> {/* sidebar-buttons */}
  </div>
  );
};

export default Sidebar;

