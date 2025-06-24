import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { Navbar } from './nav/navbar/Navbar';
import Sidebar from './nav/sidebar/Sidebar';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        // Token has expired
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login');
      }
    } catch (error) {
      // console.error('Invalid token:', error);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="admin-layout">
      <Navbar />
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
