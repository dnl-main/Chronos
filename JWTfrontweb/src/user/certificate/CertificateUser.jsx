import React from 'react';
import './certificateUser.css';
import { useNavigate } from 'react-router-dom';
import{ useState} from 'react'
import { useEffect } from 'react';
import { handleAuthToken } from '../../utils/timeout';


import CertificateUserCard from './certificateCard/CertificateUserCard';

import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';

const CertificateUser = () => {
  //token
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Start as loading

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    // If no token, navigate to login immediately
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

    // Call handleAuthToken to check for token expiry and handle logout if necessary
    handleAuthToken(token, storedUser ? JSON.parse(storedUser) : null, navigate);

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
      console.error('Failed to fetch user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;  // Or a loader component if needed
  }
  return (
    <div className="certificateUser">
    <div className="certificateUser-box">
    <main className="certificateUser-box-in">
    
      <div className="certificateUser-top">
        <div className="certificateUser-top-header">
          <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
          <header>Certificate</header>
        </div> {/* certificateUser-top-header */}

        <div className="certificateUser-top-core">
          <p className="certificateUser-top-core-medium">List of certificates</p>
          <div className="certificateUser-top-core-cards">
            <CertificateUserCard />
            <CertificateUserCard />
            <CertificateUserCard />
            <CertificateUserCard />
          </div> {/* certificateUser-top-core-cards */}
        </div> {/* certificateUser-top-core */}

        <div className="certificateUser-top-btn">
          <button className="certificateUser-top-btn-button">
            <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
            <p>Upload More</p>
          </button> {/* certificateUser-top-btn-button */}
        </div> {/* certificateUser-top-btn */}
      </div> {/* certificateUser-top */}

      <div className="certificateUser-bot">
        <p>bot</p>
      </div> {/* certificateUser-bot */}
    </main> {/* certificateUser-box-in */}
    </div> {/* certificateUser-box */}
    </div>
  );
};

export default CertificateUser;
