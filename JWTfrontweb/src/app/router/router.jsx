// src/router/Router.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';
import AuthGuard from './AuthGuard';

// Layouts
import Admin from '../layouts/admin/Admin';
import User from '../layouts/user/User';
import SuperAdmin from '../layouts/superadmin/SuperAdmin';

// Admin Pages
import Home from '../../features/admin/home/Home';
import Availability from '../../features/admin/availability/Availability';
import Account from '../../features/admin/account/Account';
import Calendar from '../../features/admin/calendar/Calendar';
import Certificate from '../../features/admin/certificate/Certificate';
import Notification from '../../features/admin/notification/Notification';
import Schedule from '../../features/admin/schedule/Schedule';

// User Pages
import HomeUser from '../../features/user/home/HomeUser';
import AccountUser from '../../features/user/account/AccountUser';
import NotificationUser from '../../features/user/notification/NotificationUser';
import CertificateUser from '../../features/user/certificate/CertificateUser';

// Superadmin Pages
import HomeSuperAdmin from '../../features/superadmin/home/HomeSuperAdmin';

// Public / Auth Pages
import Landing from '../landing/Landing';
import Signup from '../landing/onboarding/signup/Signup';
import Registration from '../landing/onboarding/register/Registration';
import Login from '../landing/onboarding/login/Login';

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path={ROUTES.LANDING} element={<Landing />} />
    <Route path={ROUTES.LOGIN} element={<Login />} />
    <Route path={ROUTES.SIGNUP} element={<Signup />} />
    <Route path={ROUTES.REGISTRATION} element={<Registration />} />

    {/* Admin Routes */}
    <Route
      path={ROUTES.ADMIN_ROOT}
      element={
        <AuthGuard>
          <Admin />
        </AuthGuard>
      }
    >
      <Route path="home" element={<Home />} />
      <Route path="account" element={<Account />} />
      <Route path="notification" element={<Notification />} />
      <Route path="availability" element={<Availability />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="certificate" element={<Certificate />} />
      <Route path="schedule" element={<Schedule />} />
    </Route>

    {/* User Routes */}
    <Route
      path={ROUTES.USER_ROOT}
      element={
        <AuthGuard>
          <User />
        </AuthGuard>
      }
    >
      <Route path="homeuser" element={<HomeUser />} />
      <Route path="accountUser" element={<AccountUser />} />
      <Route path="notificationUser" element={<NotificationUser />} />
      <Route path="CertificateUser" element={<CertificateUser />} />
    </Route>

    {/* Superadmin Routes */}
    <Route
      path={ROUTES.SUPERADMIN_ROOT}
      element={
        <AuthGuard>
          <SuperAdmin />
        </AuthGuard>
      }
    >
      <Route path="homesuperadmin" element={<HomeSuperAdmin />} />
    </Route>
  </Routes>
);

export default AppRoutes;
