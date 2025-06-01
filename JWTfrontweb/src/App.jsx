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
import ManageAppointment from './admin/appointment/ManageAppointment';
import ScheduleCard from './admin/schedule/scheduleComponents/ScheduleCard';

// Onboarding Components
import Signup from './onboarding/signup/Signup';
import Registration from './onboarding/register/Registration';
import Login from './onboarding/login/Login';
import Landing from './onboarding/landing/Landing';
import ResetPassword from './onboarding/login/ResetPassword';

// User Components
import AccountUser from './user/account/AccountUser';
import CertificateUser from './user/certificate/CertificateUser';
import CertificateUserCard from './user/certificate/certificateCard/CertificateUserCard';

// import UploadCertificate from './user/certificate/UploadCertificate';
import HomeUser from './user/home/HomeUser';
import NotificationUser from './user/notification/NotificationUser';

// Case Study Components
import CaseStudy from './deprecated/caseStudy/CaseStudy';
import CSLogin from './deprecated/caseStudy/CSLogin';

// Layouts
import Admin from './layouts/Admin';
import User from './layouts/User';
import Superadmin from './layouts/Superadmin';

// Superadmin Components
import HomeSuperAdmin from './superadmin/home/HomeSuperAdmin';
// Component
import Wrapper from './components/Wrapper';

function App() {
  return (
    <div className="all">
      <Router>
        <Routes>
          {/* Admin Routes with Layout, Wrapped */}
          <Route
            path="/admin"
            element={
              <Wrapper>
                <Admin />
              </Wrapper>
            }
          >
            {/* DEFINE DITO ADMIN FOR NO LAYOUTS */}
            {/* 
            <Route path="/admin/test1" element={<Test1 />} />
            <Route path="/admin/test2" element={<Test2 />} />
            <Route path="/admin/test3" element={<Test3 />} /> 
            */}
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

          {/* User Routes with Layout, Wrapped */}
          <Route
            path="/user"
            element={
              <Wrapper>
                <User />
              </Wrapper>
            }
          >
            <Route path="accountUser" element={<AccountUser />} />
            <Route path="certificateUserCard" element={<CertificateUserCard />} />
            <Route path="CertificateUser" element={<CertificateUser />} />
            <Route path="homeUser" element={<HomeUser />} />
            <Route path="notificationUser" element={<NotificationUser />} />
          </Route>

          {/* Superadmin Routes with Layout, Wrapped */}
          <Route
            path="/superadmin"
            element={
              <Wrapper>
                <Superadmin />
              </Wrapper>
            }
          >
            <Route path="homesuperadmin" element={<HomeSuperAdmin />} />
         
          </Route>

          {/* Onboarding Routes */}
          <Route path="/" element={<Landing />} />
          <Route
            path="/signup"
            element={
              <Signup />
            }
          />
          <Route
            path="/login"
            element={
              <Wrapper>
                <Login />
              </Wrapper>
            }
          />
          <Route
            path="/registration"
            element={
              <Wrapper>
                <Registration />
              </Wrapper>
            }
          />
          <Route
            path="/reset-password" 
            element={
              <Wrapper>
                <ResetPassword />
              </Wrapper>
            } 
          />

          {/* Case Study Routes - no layout */}
          <Route path="/caseStudy" element={<CaseStudy />} />
          <Route path="/caseLogin" element={<CSLogin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;