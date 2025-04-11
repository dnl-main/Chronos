import { Routes, Route, useNavigate } from 'react-router-dom';

// User Components
import HomeUser from "../../user/home/HomeUser";
import CertificateUser from '../../user/certificate/CertificateUser';
import NotificationUser from '../../user/notification/NotificationUser';
import AccountUser from '../../user/account/AccountUser';
import Login from '../../onboarding/login/Login';
import Signup from '../../onboarding/signup/Signup';
import Registration from '../../onboarding/register/Registration';
import WebDev from '../../admin/home/Webdev';
  // Import the WebDev component

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Navigation Testing</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <button onClick={() => navigate('/homeuser')}>HomeUser</button>
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/certificateuser')}>CertificateUser</button>
        <button onClick={() => navigate('/notificationuser')}>NotificationUser</button>
        <button onClick={() => navigate('/accountuser')}>AccountUser</button>
        <button onClick={() => navigate('/signup')}>Signup</button>
        <button onClick={() => navigate('/registration')}>Registration</button>
        <button onClick={() => navigate('/webdev')}>WebDev</button> {/* WebDev Button */}
      </div>

      {/* Routes for the different pages */}
      <Routes>
        {/* User routes */}
        <Route path="/homeuser" element={<HomeUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/certificateuser" element={<CertificateUser />} />
        <Route path="/notificationuser" element={<NotificationUser />} />
        <Route path="/accountuser" element={<AccountUser />} />
        
        {/* Onboarding routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/registration" element={<Registration />} />
        
        {/* New WebDev route */}
        <Route path="/webdev" element={<WebDev />} />
      </Routes>
    </div>
  );
}

export default Home;
