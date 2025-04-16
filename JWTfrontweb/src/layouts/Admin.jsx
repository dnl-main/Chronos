import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../admin/navbar/Navbar';
import Sidebar from '../admin/sidebar/Sidebar';

const Admin = () => {
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
