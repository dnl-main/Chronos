// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Admin Components
import Home from './admin/home/Home';
import Availability from './admin/availability/Availability';
import Account from './admin/account/Account';
import Calendar from './admin/calendar/Calendar';
import Certificate from './admin/certificate/Certificate';
import Notification from './admin/notification/Notification';
import Schedule from './admin/schedule/Schedule';
import { Navbar } from './admin/navbar/Navbar';
import Sidebar from './admin/sidebar/Sidebar';

// Onboarding Components
import Signup from './onboarding/signup/Signup';
import Registration from './onboarding/register/Registration';
import Login from './onboarding/login/Login';
import Landing from './onboarding/landing/Landing';

// User Components
import AccountUser from './user/account/AccountUser';
import CertificateUser from './user/certificate/CertificateUser';
import UploadCertificate from './user/certificate/UploadCertificate';
import HomeUser from './user/home/HomeUser';
import NavbarUser from './user/navbar/NavbarUser';
import NotificationUser from './user/notification/NotificationUser';
import SidebarUser from './user/sidebar/SidebarUser';

// Case Study Components
import CaseStudy from './deprecated/caseStudy/CaseStudy';
import CSLogin from './deprecated/caseStudy/CSLogin';

function App() {
  return (
    <div className="all">
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/sidebar" element={<Sidebar />} />

          {/* Onboarding Routes */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />

          {/* User Routes */}
          <Route path="/accountUser" element={<AccountUser />} />
          <Route path="/certificateUser" element={<CertificateUser />} />
          <Route path="/UploadCertificate" element={<UploadCertificate />} />
          <Route path="/homeUser" element={<HomeUser />} />
          <Route path="/navbarUser" element={<NavbarUser />} />
          <Route path="/notificationUser" element={<NotificationUser />} />
          <Route path="/sidebarUser" element={<SidebarUser />} />

          {/* Case Study Routes */}
          <Route path="/caseStudy" element={<CaseStudy />} />
          <Route path="/caseLogin" element={<CSLogin />} />

         
        </Routes>
      </Router>
    </div>
  );
}

export default App;
