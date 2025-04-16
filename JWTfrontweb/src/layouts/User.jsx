import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarUser from '../user/navbar/NavbarUser';
import SidebarUser from '../user/sidebar/SidebarUser';

const User = () => (
  <div className="user-layout">
    {/* <NavbarUser />
    <SidebarUser /> */}
    <div className="content">
      <Outlet />
    </div>
  </div>
);

export default User;
