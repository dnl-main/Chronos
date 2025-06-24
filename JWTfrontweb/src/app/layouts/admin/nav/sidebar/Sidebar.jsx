import React from 'react';
import './sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


// import concorde_logo from '../../assets/logo/concorde_logo.webp';
// import Calendar from '../../assets/icons/Calendar.svg';
// import House_01 from '../../assets/icons/House_01.svg?react';

// import Users from '../../assets/icons/Users.svg?react';
// import Notebook from '../../assets/icons/Notebook.svg?react';
// import Book from '../../assets/icons/Book.svg?react';

import Circle_Primary from '../../../../../assets/icons/Circle_Primary.svg?react';

const Sidebar = () => {
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('token');
      

      if (!token) {
        // console.warn('No token found, logging out anyway.');
        navigate('/');
        return;
      }

      await axios.post(`${apiUrl}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,  'ngrok-skip-browser-warning': 'true'
          
        },
      });

      sessionStorage.removeItem('token'); // Clear token
      sessionStorage.removeItem('user'); // Clear user data
      navigate('/');
    } catch (error) {
      // console.error('Logout failed:', error);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/');
    }
  };
  return (
  <div className="sidebar">
    <div className="sidebar-logo">
      
   
        <button onClick={handleLogout}>
          {/* <img src={concorde_logo} className="" alt="Search icon" /> */}
          <Circle_Primary style={{ width: '20px', height: '20px' }} />
        </button>
   
    </div> {/* sidebar-logo */}

    <div className="sidebar-buttons">
      <Link to="/admin/home">
        <button>
          {/* <House_01
            style={{
              color: "var(--primary-color)",
              '--stroke-color': 'var(--primary-color)',
              width: "32px",
              height: "32px",
              '--stroke-width': '4px'
            }}
          /> */}
          <Circle_Primary style={{ width: '20px', height: '20px' }} />
        </button>
      </Link>

      
      <Link to="/admin/availability">
        <button>
          {/* <Users style={{ width: "32px", height: "32px", color: "#00889a", strokeWidth: 2 }} /> */}
          <Circle_Primary style={{ width: '20px', height: '20px' }} />
        </button>
      </Link>
      
      {/* <Link to="/admin/calendar">
        <button>
          <img src={Calendar} className="" alt="calendar icon" />
        </button>
      </Link> */}
      
      <Link to="/admin/certificate">
      <button>
        {/* <Notebook 
          style={{ 
            color: "var(--primary-color)", 
            width: "32px", 
            height: "32px", 
            "--stroke-width": "4px"  
          }} 
        /> */}
        <Circle_Primary style={{ width: '20px', height: '20px' }} />
        </button>
      </Link>

      <Link to="/admin/schedule">
        <button>  
          {/* <Book 
            style={{ 
              color: "var(--primary-color)", 
              width: "32px", 
              height: "32px", 
              '--stroke-width': '4px' // Set the stroke width here
            }} 
          /> */}
          <Circle_Primary style={{ width: '20px', height: '20px' }} />
        </button>
      </Link>
    </div> {/* sidebar-buttons */}
  </div>
  );
};

export default Sidebar;

