import React from 'react';
import './CertificateUser.css';
import { useNavigate } from 'react-router-dom';
import{ useState} from 'react'
import { useEffect } from 'react';
import { handleAuthToken } from '../../utils/timeout';
import axios from 'axios';


import CertificateUserCard from './certificateCard/CertificateUserCard';

import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';

const CertificateUser = () => {
  //token
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Start as loading

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

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
      navigate('/login');
      return;
    }

    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));  // Make data available globally
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    navigate('/login');
  } finally {
    setLoading(false);
  }
};

// Store certificate data per card
const [certData, setCertData] = useState([]);

const handleCardDataChange = (index, data) => {
  const updated = [...certData];
  updated[index] = data;
  setCertData(updated);
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
  {[0, 1, 2, 3].map((i) => (
    <div key={i}>
      <CertificateUserCard onFileDataChange={(data) => handleCardDataChange(i, data)} />

      {certData[i]?.uploadedFile && (
        <CertificateCard
          user={`${user.firstName} ${user.middleName?.[0] || ''}. ${user.lastName}`}
          position={user.position}
          uploadedFile={certData[i].uploadedFile}
          expiryDate={certData[i].expiryDate}
        />
      )}
    </div>
  ))}
</div>

        </div> {/* certificateUser-top-core */}

        <div className="certificateUser-top-btn">
          <button className="certificateUser-top-btn-button">
            <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
            <p>Upload More</p>
          </button> {/* certificateUser-top-btn-button */}
        </div> {/* certificateUser-top-btn */}
      </div> {/* certificateUser-top */}

      <div className="certificateUser-bot">
      </div> {/* certificateUser-bot */}
    </main> {/* certificateUser-box-in */}
    </div> {/* certificateUser-box */}
    </div>
  );
};

export default CertificateUser;
