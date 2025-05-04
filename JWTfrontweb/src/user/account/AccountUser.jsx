import React from 'react';
import './accountUser.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AccountUser = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.post(
        `${apiUrl}/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div className="account-user">
      <button
        onClick={handleLogout}
        className="logout-btn"
        style={{ backgroundColor: '#00889a' }}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00889a')}
      >
        <i className="fa-solid fa-right-from-bracket"></i> Logout
      </button>
    </div>
  );
};

export default AccountUser;
