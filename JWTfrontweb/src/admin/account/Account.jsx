import './account.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ FIX: Missing import

import { Navbar } from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import Calendar from '../../assets/icons/Calendar.svg';
import Phone from '../../assets/icons/Phone.svg';
import Mail from '../../assets/icons/Mail.svg';
import Suitcase from '../../assets/icons/Suitcase.svg';
import Edit_Pencil_Line_01 from '../../assets/icons/Edit_Pencil_Line_01.svg';
import User_Square from '../../assets/icons/User_Square.svg';
import Calendar_Week from '../../assets/icons/Calendar_Week.svg';

import Edit_Pencil_01 from '../../assets/icons/Edit_Pencil_01.svg?react';
import LabelIcon from '../../assets/icons/Label.svg?react';
import More_Grid_Big from '../../assets/icons/More_Grid_Big.svg?react';

import ChangeProfilePicture from './AccountComponents/ChangeProfilePicture';
import ResetPassword from './AccountComponents/ResetPassword';
import landing_dp_1 from '../../assets/profiles/landing_dp_1.png';

const Account = () => {
  const [overlayContent, setOverlayContent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false); // ✅ FIXED
  const [showChangeProfilePicture, setShowChangeProfilePicture] = useState(false); // ✅ FIXED

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'user') {
        navigate('/user/homeuser');
        return;
      }
      if (parsedUser.role !== 'admin') {
        navigate('/login');
        return;
      }
      setUser(parsedUser);
      setLoading(false);
    } else {
      fetchUserData(token);
    }
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response.data;

      if (userData.role === 'user') {
        navigate('/user/homeuser');
        return;
      }
      if (userData.role !== 'admin') {
        navigate('/login');
        return;
      }

      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  if (loading) return null;

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
                <More_Grid_Big style={{ color: "var(--black-color)", width: "32px", height: "32px", "--stroke-width": "1.5px" }} />
                <p>Account</p>
              </div>
              <button className="account-box-in-card-header-btn" onClick={handleLogout}>
                <p>Logout</p>
              </button>
            </header>

            <main className="account-box-in-card-main">
              <img
                src={landing_dp_1}
                className="account-box-in-card-main-dp"
                alt="profile"
                onClick={() => setShowChangeProfilePicture(true)} // Optional profile pic click handler
              />
              <section className="account-box-in-card-main-bg" />
              <section className="account-box-in-card-main-info">
                <div className="account-box-in-card-main-info-left">
                  <p className="account-box-in-card-main-info-left-text">
                    {user ? `${user.first_name} ${user.middle_name?.charAt(0)}. ${user.last_name}` : "Loading..."}
                  </p>
                  <div className="account-box-in-card-main-info-left-contact">
                    <div className="account-box-in-card-main-info-left-contact-email">
                      <img src={Mail} alt="email icon" />
                      <p>{user?.email || "Loading..."}</p>
                    </div>
                    <div className="account-box-in-card-main-info-left-contact-mobile">
                      <img src={Phone} alt="phone icon" />
                      <p>{formattedPhone ? `(+63)${formattedPhone}` : 'Loading...'}</p>
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
                      <p>{user?.role || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="account-box-in-card-main-info-right-buttons">
                    <button
                      className="account-box-in-card-main-info-right-buttons-password"
                      onClick={() => setShowResetPassword(true)}
                    >
                      <img src={Edit_Pencil_Line_01} alt="password icon" />
                      <p>Change password</p>
                    </button>

                   <button
                      className="accountUser-box-in-card-main-info-right-buttons-profile"
                      onClick={() => setShowChangeProfilePicture(true)}
                    >
                      <img src={Edit_Pencil_Line_01} alt="Edit icon" />
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
          onSave={(file) => {
            console.log("Uploaded file:", file);
            setShowChangeProfilePicture(false);
          }}
        />
      )}
    </div>
  );
};

export default Account;
