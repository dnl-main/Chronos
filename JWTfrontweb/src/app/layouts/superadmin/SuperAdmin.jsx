import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import NavbarSuperAdmin from './nav/navbar/NavbarSuperAdmin';
import SidebarSuperAdmin from './nav/sidebar/SidebarSuperAdmin';


const SuperAdmin = () => {
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
    <div className="superadmin-layout">
      <NavbarSuperAdmin />
      <SidebarSuperAdmin />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdmin;