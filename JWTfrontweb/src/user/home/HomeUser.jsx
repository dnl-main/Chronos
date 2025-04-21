import React, { useEffect, useState } from 'react';
import './homeUser.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleAuthToken } from '../../utils/timeout';
import { Navbar } from '../../admin/navbar/Navbar';
import Sidebar from '../../admin/sidebar/Sidebar';
import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Clock from '../../assets/icons/Clock.svg?react';

const HomeUser = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const statusOptions = ['On Board', 'Available', 'Vacation'];

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
      if (parsedUser.role !== 'user') {
        navigate('/login');
        return;
      }
      setUser(parsedUser);
      setSelectedStatus(parsedUser.availability || 'Available'); // Default to 'Available' if null
    } else {
      fetchUserData(token);
    }

    setLoading(false);
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data;
      if (userData.role !== 'user') {
        navigate('/login');
        return;
      }
      setUser(userData);
      setSelectedStatus(userData.availability || 'Available');
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSaveStatus = async () => {
    setStatusLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${apiUrl}/user/availability`,
        { availability: selectedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('Status updated:', updatedUser.availability);
    } catch (error) {
      console.error('Failed to update status:', error.response?.data || error.message);
      alert(error.response?.data.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found, logging out anyway.');
        navigate('/');
        return;
      }
      await axios.post(
        `${apiUrl}/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`${apiUrl}/upload-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Upload successful!');
      console.log(response.data);
    } catch (error) {
      console.error(error.response?.data);
      alert('Upload failed');
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="homeUser">
      <div className="homeUser-box">
        <main className="homeUser-box-in">
          <div className="homeUser-top">
            <div className="homeUser-top-header">
              <div className="homeUser-top-header-left">
                <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                <header>Home</header>
              </div>
              <div className="homeUser-top-header-right">
                <div className="homeUser-top-header-right-status">
                  <main className="homeUser-top-header-right-status-in">
                    <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                    <select
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      style={{
                        padding: '4px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        background: '#fff',
                        fontSize: '14px',
                      }}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </main>
                </div>
                <button
                  className="homeUser-top-header-right-btn"
                  onClick={handleSaveStatus}
                  disabled={statusLoading || selectedStatus === user.availability}
                  title="Save status"
                >
                  <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                  {statusLoading && <h6>Saving...</h6>}
                </button>
              </div>
            </div>
            <div className="homeUser-top-core">
              <div className="homeUser-top-core-left">
                <div className="homeUser-top-core-left-header">
                  <header>Scheduled appointment</header>
                  <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                </div>
                <div className="homeUser-top-core-left-heading">
                  <p>You have an appointment</p>
                </div>
                <div className="homeUser-top-core-left-date">
                  <div className="homeUser-top-core-left-date-cal">
                    <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                    <p>DEC</p>
                    <p>28</p>
                  </div>
                  <div className="homeUser-top-core-left-date-data">
                    <div className="homeUser-top-core-left-date-data-text">
                      <p className="homeUser-top-core-left-date-data-text-regular">December 28, 2025</p>
                      <p className="homeUser-top-core-left-date-data-text-light">Thursday</p>
                    </div>
                    <div className="homeUser-top-core-left-date-data-cards">
                      <div className="homeUser-top-core-left-date-data-cards-start">
                        <Clock
                          style={{
                            width: "24px",
                            height: "24px",
                            '--stroke-color': 'var(--black-color-opacity-30)',
                            '--stroke-width': '5px',
                          }}
                        />
                        <div className="homeUser-top-core-left-date-data-cards-start-text">
                          <p className="homeUser-top-core-left-date-data-cards-start-text-light">Starts at</p>
                          <p className="homeUser-top-core-left-date-data-cards-start-text-medium">11:30 AM</p>
                        </div>
                      </div>
                      <div className="homeUser-top-core-left-date-data-cards-end">
                        <Clock
                          style={{
                            width: "24px",
                            height: "24px",
                            '--stroke-color': 'var(--black-color-opacity-30)',
                            '--stroke-width': '5px',
                          }}
                        />
                        <div className="homeUser-top-core-left-date-data-cards-end-text">
                          <p className="homeUser-top-core-left-date-data-cards-end-text-light">Ends at</p>
                          <p className="homeUser-top-core-left-date-data-cards-end-text-medium">12:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="homeUser-top-core-left-btn">
                  <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                  <p>Set appointment</p>
                </button>
              </div>
              <div className="homeUser-top-core-right">
                <div className="homeUser-top-core-right-header">
                  <header>Certificate upload</header>
                  <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                </div>
                <div className="homeUser-top-core-right-progress">
                  <div className="homeUser-top-core-right-progress-text">
                    <p>Your progress</p>
                    <div className="homeUser-top-core-right-progress-text-box">
                      <p className="homeUser-top-core-right-progress-text-box-regular">75% complete</p>
                      <p className="homeUser-top-core-right-progress-text-box-light">3 out of 4 uploaded</p>
                    </div>
                  </div>
                  <div className="homeUser-top-core-right-progress-bar">
                    <div className="homeUser-top-core-right-progress-bar-primary">
                      NEED COLOR
                    </div>
                  </div>
                </div>
                <div className="homeUser-top-core-right-up">
                  <div className="homeUser-top-core-right-up-desc">
                    <div className="homeUser-top-core-right-up-desc-header">
                      <p>file upload</p>
                      <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                    </div>
                    <p className="homeUser-top-core-right-up-desc-light">Select the type of certificate</p>
                  </div>
                  <button className="homeUser-top-core-right-up-btn">
                    <div className="homeUser-top-core-right-up-btn-header">
                      <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                      <p>Medical</p>
                    </div>
                    <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                  </button>
                </div>
                <div className="homeUser-top-core-right-down">
                  <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                  <div className="homeUser-top-core-right-down-text">
                    <p className="homeUser-top-core-right-down-text-bold">Choose a file to upload</p>
                    <p className="homeUser-top-core-right-down-text-light">JPEG, PNG, and PDF formats, up to 50 MB</p>
                  </div>
                  <button className="homeUser-top-core-right-down-btn">
                    <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                    <p>Browse files</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="homeUser-bot"></div>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </main>
      </div>
    </div>
  );
};

export default HomeUser;