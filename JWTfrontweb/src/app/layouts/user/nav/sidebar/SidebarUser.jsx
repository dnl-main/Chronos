import React, { useState, useEffect, useRef } from 'react';
import './sidebarUser.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// import concorde_logo from '../../assets/logo/concorde_logo.webp';
// import House_01 from '../../assets/icons/House_01.svg?react';
// import Notebook from '../../assets/icons/Notebook.svg?react';

import Circle_Primary from '../../../../../assets/icons/Circle_Primary.svg?react';


const SidebarUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('token');

      if (!token) {
        navigate('/');
        return;
      }

      await axios.post(`${apiUrl}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });

      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/');
    }
  };

  // === Auto-close sidebar on mouse leave (mobile only) ===
  useEffect(() => {
    const sidebar = sidebarRef.current;

    const handleMouseLeave = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      }
    };

    if (sidebar) {
      sidebar.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <>
      {/* Hamburger Toggle for Mobile */}
      <button className="hamburger" onClick={toggleSidebar} aria-label="Toggle sidebar">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div ref={sidebarRef} className={`sidebarUser ${isOpen ? 'open' : ''}`}>
        <div className="sidebarUser-logo">
          <button onClick={handleLogout}>
            {/* <img src={concorde_logo} alt="main icon" /> */}
            <Circle_Primary style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <div className="sidebarUser-buttons">
          <button>
            <Link to="/user/homeUser">
              {/* <House_01
                style={{
                  color: 'var(--primary-color)',
                  '--stroke-color': 'var(--primary-color)',
                  width: '32px',
                  height: '32px',
                  '--stroke-width': '4px',
                }}
              /> */}
              <Circle_Primary style={{ width: '20px', height: '20px' }} />
            </Link>
          </button>

          <button>
            <Link to="/user/certificateUser">
              {/* <Notebook
                style={{
                  color: 'var(--primary-color)',
                  width: '32px',
                  height: '32px',
                  '--stroke-width': '4px',
                }}
              /> */}
              <Circle_Primary style={{ width: '20px', height: '20px' }} />
            </Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarUser;
