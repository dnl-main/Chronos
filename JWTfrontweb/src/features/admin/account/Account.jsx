import React, { useState, useEffect } from 'react';
import './account.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAccountLogic, formatPhoneNumber } from './accountLogic';
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
import defaultdp from '../../assets/profiles/defaultdp.png';
import Spinner from '../../components/Spinner';

const Account = () => {
    const {
    user,
    loading,
    error,
    handleLogout,
    handleProfilePictureSave,
    storageUrl,
  } = useAccountLogic();

  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showChangeProfilePicture, setShowChangeProfilePicture] = useState(false);

  if (loading) return <Spinner />;

  const formattedPhone = user?.mobile ? `(+63)${formatPhoneNumber(user.mobile)}` : 'N/A';

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
                <p className="accountUser-box-in-card-header-left-semi">Account</p>
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
                src={user?.profile_picture ? `${storageUrl}/${user.profile_picture}` : defaultdp}
                className="account-box-in-card-main-dp"
                alt="profile"
                onError={(e) => {
                  //console.log('Image Load Error:', e);
                  e.target.src = defaultdp;
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

                      <div className="account-box-in-card-main-info-right-job-department">
                      <LabelIcon className="label-icon" />
                      <p>Department: {user?.department || 'N/A'}</p> {/* Updated to show position instead of role */}
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