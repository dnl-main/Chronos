import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';
import AuthGuard from './AuthGuard';
import Spinner from '../../components/ui/Spinner';

// Layouts
const Admin = lazy(() => import('../layouts/admin/Admin'));
const User = lazy(() => import('../layouts/user/User'));
const SuperAdmin = lazy(() => import('../layouts/superadmin/SuperAdmin'));

// Admin Pages
const Home = lazy(() => import('../../features/admin/home/Home'));
const Account = lazy(() => import('../../features/admin/account/Account'));
const Notification = lazy(() => import('../../features/admin/notification/Notification'));
const Availability = lazy(() => import('../../features/admin/availability/Availability'));
const Calendar = lazy(() => import('../../features/admin/calendar/Calendar'));
const Certificate = lazy(() => import('../../features/admin/certificate/Certificate'));
const Schedule = lazy(() => import('../../features/admin/schedule/Schedule'));

// User Pages
const HomeUser = lazy(() => import('../../features/user/home/HomeUser'));
const AccountUser = lazy(() => import('../../features/user/account/AccountUser'));
const NotificationUser = lazy(() => import('../../features/user/notification/NotificationUser'));
const CertificateUser = lazy(() => import('../../features/user/certificate/CertificateUser'));

// Superadmin Pages
const HomeSuperAdmin = lazy(() => import('../../features/superadmin/home/HomeSuperAdmin'));

const ProtectedRoutes = () => (
  <Routes>
    {/* Admin Routes */}
    <Route
      path={ROUTES.ADMIN_ROOT}
      element={
        <AuthGuard>
          <Suspense fallback={<Spinner />}>
            <Admin />
          </Suspense>
        </AuthGuard>
      }
    >
      <Route path="home" element={<Suspense fallback={<Spinner />}><Home /></Suspense>} />
      <Route path="account" element={<Suspense fallback={<Spinner />}><Account /></Suspense>} />
      <Route path="notification" element={<Suspense fallback={<Spinner />}><Notification /></Suspense>} />
      <Route path="availability" element={<Suspense fallback={<Spinner />}><Availability /></Suspense>} />
      <Route path="calendar" element={<Suspense fallback={<Spinner />}><Calendar /></Suspense>} />
      <Route path="certificate" element={<Suspense fallback={<Spinner />}><Certificate /></Suspense>} />
      <Route path="schedule" element={<Suspense fallback={<Spinner />}><Schedule /></Suspense>} />
    </Route>

    {/* User Routes */}
    <Route
      path={ROUTES.USER_ROOT}
      element={
        <AuthGuard>
          <Suspense fallback={<Spinner />}>
            <User />
          </Suspense>
        </AuthGuard>
      }
    >
      <Route path="homeuser" element={<Suspense fallback={<Spinner />}><HomeUser /></Suspense>} />
      <Route path="accountUser" element={<Suspense fallback={<Spinner />}><AccountUser /></Suspense>} />
      <Route path="notificationUser" element={<Suspense fallback={<Spinner />}><NotificationUser /></Suspense>} />
      <Route path="CertificateUser" element={<Suspense fallback={<Spinner />}><CertificateUser /></Suspense>} />
    </Route>

    {/* Superadmin Routes */}
    <Route
      path={ROUTES.SUPERADMIN_ROOT}
      element={
        <AuthGuard>
          <Suspense fallback={<Spinner />}>
            <SuperAdmin />
          </Suspense>
        </AuthGuard>
      }
    >
      <Route path="homesuperadmin" element={<Suspense fallback={<Spinner />}><HomeSuperAdmin /></Suspense>} />
    </Route>
  </Routes>
);

export default ProtectedRoutes;
