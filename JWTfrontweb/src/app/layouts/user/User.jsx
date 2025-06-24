import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import NavbarUser from './nav/navbar/NavbarUser';
import SidebarUser from './nav/sidebar/SidebarUser';

const User = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // in seconds

      if (decoded.exp < currentTime) {
        // Token is expired
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login');
      }
    } catch (err) {
      // console.error('Invalid token:', err);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="user-layout">
      <NavbarUser />
      <SidebarUser />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default User;
