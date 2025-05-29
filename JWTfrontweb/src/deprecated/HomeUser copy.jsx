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

useEffect(() => {
  const token = sessionStorage.getItem('token');
  const storedUser = sessionStorage.getItem('user');
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
      navigate('/login');  // Return to Login
      return;
    }

    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));

  } catch (error) {
    // console.error('Failed to fetch user data:', error);
    navigate('/login');
  } finally {
    setLoading(false);
  }
};

//BLOCK TO
if (loading) {
  return null;  
}

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('token');

      if (!token) {
        // console.warn('No token found, logging out anyway.');
        navigate('/');
        return;
      }

      await axios.post(`${apiUrl}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      sessionStorage.removeItem('token'); // Clear token
      sessionStorage.removeItem('user'); // Clear user data
      navigate('/');
    } catch (error) {
      // console.error('Logout failed:', error);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/');
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
  <div className="homeUser">
    <div className="homeUser-box">
    <main className="homeUser-box-in">
      <div className="homeUser-top">
        <div className="homeUser-top-header">
          <div className="homeUser-top-header-left">
            <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
            <header>Home</header>
          </div> {/* homeUser-top-header-left */}

          <div className="homeUser-top-header-right">
            <div className="homeUser-top-header-right-status">
              <main className="homeUser-top-header-right-status-in">
                <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                <p>{user.availability}</p>
              </main> {/* homeUser-top-header-right-status-in */}
            </div> {/* homeUser-top-header-right-status */}

            <button className="homeUser-top-header-right-btn">
              <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
            </button> {/* homeUser-top-header-right-btn */}
          </div> {/* homeUser-top-header-right */}
        </div> {/* homeUser-top-header */}
        
        <div className="homeUser-top-core">
          <div className="homeUser-top-core-left">

            <div className="homeUser-top-core-left-header">
              <header>Scheduled appointment</header>
              <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
            </div> {/* homeUser-top-core-left-header */}

            <div className="homeUser-top-core-left-heading">
              <p>You have an apppointment</p>
            </div> {/* homeUser-top-core-left-heading */}

            <div className="homeUser-top-core-left-date">
              <div className="homeUser-top-core-left-date-cal">
                <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                <p>DEC</p>
                <p>28</p>
              </div> {/* homeUser-top-core-left-date-cal */}

              <div className="homeUser-top-core-left-date-data">
                <div className="homeUser-top-core-left-date-data-text">
                  <p className="homeUser-top-core-left-date-data-text-regular">December 28, 2025</p>
                  <p className="homeUser-top-core-left-date-data-text-light">Thursday</p>
                </div> {/* homeUser-top-core-left-date-data-text */}

                <div className="homeUser-top-core-left-date-data-cards">


                  <div  className="homeUser-top-core-left-date-data-cards-start">
                    <Clock style={{ 
                      width: "24px", 
                      height: "24px", 
                      '--stroke-color': 'var(--black-color-opacity-30)', 
                      '--stroke-width': '5px' 
                    }} />
                    <div className="homeUser-top-core-left-date-data-cards-start-text">
                      <p className="homeUser-top-core-left-date-data-cards-start-text-light">Starts at</p>
                      <p className="homeUser-top-core-left-date-data-cards-start-text-medium">11:30 AM</p>
                    </div> {/* homeUser-top-core-left-date-data-cards-start-text */}
                  </div> {/* homeUser-top-core-left-date-data-cards-start */}

                  <div  className="homeUser-top-core-left-date-data-cards-end">
                    <Clock style={{ 
                      width: "24px", 
                      height: "24px", 
                      '--stroke-color': 'var(--black-color-opacity-30)', 
                      '--stroke-width': '5px' 
                    }} />
                    <div className="homeUser-top-core-left-date-data-cards-end-text">
                      <p className="homeUser-top-core-left-date-data-cards-end-text-light">Ends at</p>
                      <p className="homeUser-top-core-left-date-data-cards-end-text-medium">12:00 PM</p>
                    </div> {/* homeUser-top-core-left-date-data-cards-end-text */}
                  </div> {/* homeUser-top-core-left-date-data-cards-end */}
                </div> {/* homeUser-top-core-left-date-data-cards */}
              </div> {/* homeUser-top-core-left-date-data */}
            </div> {/* homeUser-top-core-left-date */}

            <button className="homeUser-top-core-left-btn">
              <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
              <p>Set appointment</p>
            </button> {/* homeUser-top-core-left-btn */}
          </div> {/* homeUser-top-core-left */}


          <div className="homeUser-top-core-right">

            <div className="homeUser-top-core-right-header">
              <header>Certificate upload</header>
              <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
            </div> {/* homeUser-top-core-right-header */}

            <div className="homeUser-top-core-right-progress">
              <div className="homeUser-top-core-right-progress-text">
                <p>Your progress</p>
                <div className="homeUser-top-core-right-progress-text-box">
                  <p className="homeUser-top-core-right-progress-text-box-regular">75% complete</p>
                  <p className="homeUser-top-core-right-progress-text-box-light">3 out of 4 uploaded</p>
                </div> {/* homeUser-top-core-right-progress-text-box */}
              </div> {/* homeUser-top-core-right-progress-text */}

              <div className="homeUser-top-core-right-progress-bar">
                <div className="homeUser-top-core-right-progress-bar-primary">
                  NEED COLOR
                </div> {/* homeUser-top-core-right-progress-bar-primary */}
              </div> {/* homeUser-top-core-right-progress-bar */}
            </div> {/* homeUser-top-core-right-progress */}

            <div className="homeUser-top-core-right-up">
              <div className="homeUser-top-core-right-up-desc">
                <div className="homeUser-top-core-right-up-desc-header">
                  <p>File upload</p>
                  <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                </div> {/* homeUser-top-core-right-up-desc-header */}
                <p className="homeUser-top-core-right-up-desc-light">Select the type of certificate</p>
              </div> {/* homeUser-top-core-right-up-desc */}

              <button className="homeUser-top-core-right-up-btn">
                <div className="homeUser-top-core-right-up-btn-header">
                  <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                  <p>Medical</p>
                </div> {/* homeUser-top-core-right-up-btn-header */}
                <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
              </button> {/* homeUser-top-core-right-up-btn */}
            </div> {/* homeUser-top-core-right-up */}

            <div className="homeUser-top-core-right-down">
              <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
              <div className="homeUser-top-core-right-down-text">
                <p className="homeUser-top-core-right-down-text-bold">Choose a file to upload</p>
                <p className="homeUser-top-core-right-down-text-light">JPEG, PNG, and PDF formats, up to 50 MB</p>
              </div> {/* homeUser-top-core-right-down-text */}

              <button className="homeUser-top-core-right-down-btn">
                <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                <p>Browse files</p>
              </button> {/* homeUser-top-core-right-down-btn */}
            </div> {/* homeUser-top-core-right-down */}
          </div> {/* homeUser-top-core-right */}
        </div> {/* homeUser-top-core */}
      </div> {/* homeUser-top */}

      <div className="homeUser-bot">
      </div> {/* homeUser-bot */}

      <button onClick={handleLogout} className="logout-btn">
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>

    </main> {/* homeUser-box-in */}
    </div> {/* homeUser-box */}
  </div>
  );
};

export default HomeUser;
