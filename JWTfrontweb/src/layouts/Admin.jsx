import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from '../admin/navbar/Navbar';
import Sidebar from '../admin/sidebar/Sidebar';
import { jwtDecode } from 'jwt-decode';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        // Token has expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
