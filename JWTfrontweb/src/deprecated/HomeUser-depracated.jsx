import React, { useEffect, useState } from 'react';
import './homeUser.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleAuthToken } from '../../utils/timeout';

const HomeUser = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Start as loading

useEffect(() => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  handleAuthToken(token, storedUser ? JSON.parse(storedUser) : null, navigate);
  if (!token) {
    navigate('/login');
    return;
  }

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);

    // If role is not 'user', navigate to login
    if (parsedUser.role !== 'user') {
      navigate('/login');
      return;
    }

    setUser(parsedUser);
  } else {
    fetchUserData(token);
  }

  // Stop loading after check
  setLoading(false);

}, [navigate]);

const fetchUserData = async (token) => {
  try {
    const response = await axios.get(`${apiUrl}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userData = response.data;

    if (userData.role !== 'user') {
      navigate('/login');  // Redirect if role is not 'user'
      return;
    }

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

  } catch (error) {
    // console.error('Failed to fetch user data:', error);
    navigate('/login');
  } finally {
    setLoading(false);
  }
};


if (loading) {
  return null;  
}

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        // console.warn('No token found, logging out anyway.');
        navigate('/login');
        return;
      }

      await axios.post(`${apiUrl}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Clear user data too
      navigate('/login');
    } catch (error) {
      // console.error('Logout failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };
  
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post(`${apiUrl}/upload-pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      alert('Upload successful!');
      // console.log(response.data);
    } catch (error) {
      // console.error(error.response?.data);
      alert('Upload failed');
    }
  };
  
  return (
    <div className="container">
      {/* Add h1 with user's first_name and last_name */}
      {user ? (
        <h1>Welcome, {user.first_name} {user.middle_name} {user.last_name}!</h1>
      ) : (
        <h1>Loading...</h1> // Placeholder while fetching
      )}

      <div className="header">
        <div className="home-icon">
          <i className="fa-solid fa-house"></i>
          <span>Home</span>
        </div>
        <div className="status-indicator">
          <i className="fa-solid fa-circle-check"></i>
          <span className="status-text">Available</span>
          <i className="fa-solid fa-angle-down"></i>
        </div>
      </div>

      <div className="main-content">
        <div className="scheduled-certificate-wrapper">
          {/* Scheduled Appointment Section */}
          <div className="card scheduled-appointment">
            <h3>You have an appointment</h3>
            <div className="appointment-details">
              <i className="fa-solid fa-calendar-days"></i>
              <div>
                <p className="date">December 28, 2024</p>
                <p className="time">Starts at: 12:30 PM</p>
                <p className="time">Ends at: 1:00 PM</p>
              </div>
            </div>
            <button className="set-appointment">Set Appointment</button>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
          {/* Certificate Upload Section */}
          <div className="card certificate-upload">
            <h3>Certificate Upload</h3>
            <p>Your progress: <strong>75% complete</strong></p>
            <div className="progress-bar">
              <div className="progress" style={{ width: '75%' }}></div>
            </div>
            <div className="file-upload">
              <label htmlFor="certificate-type">Select the type of certificate:</label>
              <select id="certificate-type">
                <option value="medical">Medical</option>
              </select>
              <div className="file-input">
                <label htmlFor="file-upload">
                  <i className="fa-solid fa-upload"></i> Choose a file to upload
                </label>
                <input type="file" id="file-upload" accept=".jpeg, .png, .pdf" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="notifications">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#444' }}>
          <i className="fa-solid fa-bell" style={{ color: '#00899A' }}></i>
          Notifications
        </h3>
        <div className="notification-item">
          <div className="profile-icon"></div>
          <div className="details">
            <p>
              <strong>John Doe</strong> - Fleet Crew Manager
            </p>
            <p className="subtext">You have an appointment with John Doe</p>
            <div className="date-time">
              <div className="date-card">
                <p className="date">
                  <i className="fa-solid fa-calendar-days"></i> Monday, Dec 28, 2024
                </p>
              </div>
              <div className="start-time-card">
                <p className="time">
                  <i className="fa-solid fa-clock"></i> Starts at: 11:30 AM
                </p>
              </div>
              <div className="end-time-card">
                <p className="time">
                  <i className="fa-solid fa-clock"></i> Ends at: 12:00 PM
                </p>
              </div>
            </div>
          </div>
          <button className="new-appointment">New Appointment</button>
          <i className="fas fa-check-circle check-icon"></i>
        </div>
      </div>
    </div>
  );
};

export default HomeUser;