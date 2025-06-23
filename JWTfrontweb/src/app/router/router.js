// src/router/router.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';
import AuthGuard from './AuthGuard';

// Layouts
import Admin from '../layouts/Admin';
import User from '../layouts/User';
import SuperAdmin from '../layouts/SuperAdmin';

// Admin Pages
import Home from '../admin/home/Home';
import Availability from '../admin/availability/Availability';
import Account from '../admin/account/Account';
import Calendar from '../admin/calendar/Calendar';
import Certificate from '../admin/certificate/Certificate';
import Notification from '../admin/notification/Notification';
import Schedule from '../admin/schedule/Schedule';
import ManageAppointment from '../admin/appointment/ManageAppointment';
import ScheduleCard from '../admin/schedule/scheduleComponents/ScheduleCard';

// User Pages
import HomeUser from '../user/home/HomeUser';
import AccountUser from '../user/account/AccountUser';
import NotificationUser from '../user/notification/NotificationUser';
import CertificateUser from '../user/certificate/CertificateUser';
import CertificateUserCard from '../user/certificate/certificateCard/CertificateUserCard';

// Superadmin Pages
import HomeSuperAdmin from '../superadmin/home/HomeSuperAdmin';

// Public / Auth Pages
import Landing from '../onboarding/landing/Landing';
import Signup from '../onboarding/signup/Signup';
import Registration from '../onboarding/register/Registration';
import Login from '../onboarding/login/Login';

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
      <Route path="schedule-card" element={<ScheduleCard />} />
      <Route path="manage-appointment" element={<ManageAppointment />} />
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
      <Route path="certificateUserCard" element={<CertificateUserCard />} />
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
