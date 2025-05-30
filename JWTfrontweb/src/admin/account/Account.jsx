import './account.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Navbar } from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import Phone from '../../assets/icons/Phone.svg';
import Mail from '../../assets/icons/Mail.svg';
import Suitcase from '../../assets/icons/Suitcase.svg';
import Edit_Pencil_Line_01 from '../../assets/icons/Edit_Pencil_Line_01.svg';
import Edit_Pencil_01 from '../../assets/icons/Edit_Pencil_01.svg?react';
import LabelIcon from '../../assets/icons/Label.svg?react';
import More_Grid_Big from '../../assets/icons/More_Grid_Big.svg?react';
import ChangeProfilePicture from './AccountComponents/ChangeProfilePicture';
import ResetPassword from './AccountComponents/ResetPassword';
import landing_dp_1 from '../../assets/profiles/landing_dp_1.png';
import Spinner from '../../components/Spinner';

const Account = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  const storageUrl = import.meta.env.VITE_STORAGE_BASE_URL || 'http://127.0.0.1:8000/storage';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showChangeProfilePicture, setShowChangeProfilePicture] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('token');
        const storedUser = sessionStorage.getItem('user');

        if (!token) {
          navigate('/login');
          return;
        }

        let userData = storedUser ? JSON.parse(storedUser) : null;

        if (userData) {
          if (userData.role === 'user') {
            navigate('/user/homeuser');
            return;
          }
          if (userData.role !== 'admin') {
            navigate('/login');
            return;
          }
        } else {
          const response = await axios.get(`${apiUrl}/user`, {
         headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true' // Add to bypass warning page
        },
          });
          userData = response.data;

          if (userData.role === 'user') {
            navigate('/user/homeuser');
            return;
          }
          if (userData.role !== 'admin') {
            navigate('/login');
            return;
          }
        }

        // Check needs_position from login endpoint
        const loginResponse = await axios.post(`${apiUrl}/login`, {}, {
         headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true' // Add this to bypass ngrok warning
      },
          withCredentials: true,
        });

        userData.needs_position = loginResponse.data.needs_position;
        sessionStorage.setItem('user', JSON.stringify(userData));

        // Fetch profile picture
        const profilePictureResponse = await axios.get(`${apiUrl}/user/profile-picture`, {
          headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true' // Add this to bypass ngrok warning
      },
        });

        setUser({
          ...userData,
          profile_picture: profilePictureResponse.data.path || null,
        });

        // Show alert and open ChangeProfilePicture if position is needed
        // if (loginResponse.data.needs_position) {
        //   alert('Please input your position in the Account Page.');
        //   setShowChangeProfilePicture(true);
        // }
      } catch (error) {
        console.log('Fetch User Error:', error.response?.data, error.message);
        setError('Failed to load user data. Please try again.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [apiUrl, navigate]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.post(`${apiUrl}/logout`, {}, { headers: { Authorization: `Bearer ${token}`,  'ngrok-skip-browser-warning': 'true' } });
    } catch (error) {
      alert('Logout failed: ' + error.message);
    } finally {
      setLoading(false);
      sessionStorage.clear();
      navigate('/login');
    }
  };

  const handleProfilePictureSave = (profilePictureUrl) => {
    setUser((prevUser) => ({
      ...prevUser,
      profile_picture: profilePictureUrl,
    }));
    setShowChangeProfilePicture(false);
    window.location.reload(); // Removed to prevent unnecessary reload
  };

  if (loading) return <Spinner />;

  let formattedPhone = 'N/A';
  if (user?.mobile) {
    const rawPhone = user.mobile;
    const cleaned = rawPhone.startsWith('0') ? rawPhone.substring(1) : rawPhone;
    formattedPhone = cleaned.length >= 10
      ? `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
      : cleaned;
  }

  return (
    <div className="account">
      <Navbar />
      <Sidebar />
      <div className="account-box">
        <div className="account-box-in">
          <main className="account-box-in-card">
            <header className="account-box-in-card-header">
              <div className="account-box-in-card-header-left">
                <More_Grid_Big
                  style={{ color: 'var(--black-color)', width: '32px', height: '32px', '--stroke-width': '1.5px' }}
                />
                <p>Account</p>
              </div>
              <button
                className="account-box-in-card-header-btn"
                onClick={handleLogout}
                disabled={loading}
              >
                <p>Logout</p>
              </button>
            </header>

            <main className="account-box-in-card-main">
              <img
                src={user?.profile_picture ? `${storageUrl}/${user.profile_picture}` : landing_dp_1}
                className="account-box-in-card-main-dp"
                alt="profile"
                onError={(e) => {
                  console.log('Image Load Error:', e);
                  e.target.src = landing_dp_1;
                  setError('Failed to load profile picture.');
                }}
              />
              <section className="account-box-in-card-main-bg" />
              <section className="account-box-in-card-main-info">
                <div className="account-box-in-card-main-info-left">
                  <p className="account-box-in-card-main-info-left-text">
                    {user ? `${user.first_name}${user.middle_name ? ` ${user.middle_name.charAt(0)}.` : ''} ${user.last_name}` : 'Loading...'}
                  </p>
                  <div className="account-box-in-card-main-info-left-contact">
                    <div className="account-box-in-card-main-info-left-contact-email">
                      <img src={Mail} alt="email icon" />
                      <p>{user?.email || 'Loading...'}</p>
                    </div>
                    <div className="account-box-in-card-main-info-left-contact-mobile">
                      <img src={Phone} alt="phone icon" />
                      <p>{formattedPhone ? `(+63)${formattedPhone}` : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="account-box-in-card-main-info-right">
                  <div className="account-box-in-card-main-info-right-job">
                    <div className="account-box-in-card-main-info-right-job-header">
                      <img src={Suitcase} alt="Suitcase icon" />
                      <p>Job title</p>
                    </div>
                    <div className="account-box-in-card-main-info-right-job-title">
                      <LabelIcon className="label-icon" />
                      <p>{user?.position || 'N/A'}</p> {/* Updated to show position instead of role */}
                    </div>
                  </div>

                  <div className="account-box-in-card-main-info-right-buttons">
                    <button
                      className="account-box-in-card-main-info-right-buttons-password"
                      onClick={() => setShowResetPassword(true)}
                      disabled={loading}
                    >
                      <img src={Edit_Pencil_Line_01} alt="password icon" />
                      <p>Change password</p>
                    </button>

                    <button
                      className="account-box-in-card-main-info-right-buttons-profile"
                      onClick={() => setShowChangeProfilePicture(true)}
                      disabled={loading}
                    >
                      <img src={Edit_Pencil_01} alt="edit icon" />
                      <p>Edit profile</p>
                    </button>
                  </div>
                </div>
              </section>
            </main>
          </main>
        </div>
      </div>

      {showResetPassword && (
        <ResetPassword closeResetPassword={() => setShowResetPassword(false)} />
      )}
      {showChangeProfilePicture && (
        <ChangeProfilePicture
          onClose={() => setShowChangeProfilePicture(false)}
          onSave={handleProfilePictureSave}
        />
      )}
    </div>
  );
};

export default Account;