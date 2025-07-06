import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';
import Bell from '../../../../assets/icons/Bell.svg?react';
import '../home.css';

const HomeCertAdmin = () => {
  const [expiringCertificates, setExpiringCertificates] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchExpiringCertificates = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get(`${apiUrl}/certificates`, {
headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true' // Add this to bypass ngrok warning
      },
        withCredentials: true,
      });

      // Get current month and year (May 2025)
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const formatted = await Promise.all(
        response.data.certificates.map(async (cert) => {
          // Fetch user details for user_name
          let user_name = 'Unknown User';
          try {
            const userResponse = await axios.get(`${apiUrl}/users/${cert.user_id}`, {
headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true' // Add this to bypass ngrok warning
      },
              withCredentials: true,
            });
            user_name = `${userResponse.data.first_name} ${userResponse.data.last_name}`;
          } catch (error) {
            // console.error(`Failed to fetch user ${cert.user_id}:`, error);
          }

          return {
            id: cert.id,
            certificate_type: cert.certificate_type,
            certificate_name: cert.certificate_name,
            expiration_date: cert.expiration_date,
            file_path: cert.file_path,
            user_name,
          };
        })
      );

      const filtered = formatted
        .filter(cert => {
          if (!cert.expiration_date) return false;
          const expDate = new Date(cert.expiration_date);
          return (
            expDate.getMonth() === currentMonth &&
            expDate.getFullYear() === currentYear &&
            expDate >= currentDate
          );
        })
        .sort((a, b) => new Date(a.expiration_date) - new Date(b.expiration_date));

      setExpiringCertificates(filtered);
      // console.log('Expiring Certificates (This Month):', filtered);
    } catch (error) {
      // console.error('Failed to fetch certificates:', error);
    }
  };

  useEffect(() => {
    fetchExpiringCertificates();
  }, []); // Remove onUploadSuccess dependency

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).toUpperCase();
  };

  // Handle Notify button click to navigate to admin/certificate
  const handleNotifyClick = (certificate) => {
    navigate('/admin/certificate', { state: { certificate } });
  };

  return (
    <div className="home-top-main-right-cards">
      {expiringCertificates.length > 0 ? (
        expiringCertificates.slice(0, 3).map((certificate) => (
          <main key={certificate.id} className="home-top-main-right-cards-card">
            <div className="home-top-main-right-cards-card-up">
              <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "28px", height: "28px" }} />
              <div className="home-top-main-right-cards-card-up-text">
                <p className="home-top-main-right-cards-card-up-text-name">{certificate.user_name}</p>
                <p className="home-top-main-right-cards-card-up-text-cert">{certificate.certificate_type}</p>
              </div>
            </div>
            <div className="home-top-main-right-cards-card-down">
              <button
                className="home-top-main-right-cards-card-down-btn"
                onClick={() => handleNotifyClick(certificate)}
              >
                <p>Notify</p>
                <Bell style={{ color: "var(--primary-color)", width: "20px", height: "20px", '--stroke-width': '5' }} />
              </button>
              <div className="home-top-main-right-cards-card-down-text">
                <p className="home-top-main-right-cards-card-down-text-expiry">Expires at:</p>
                <p className="home-top-main-right-cards-card-down-text-date">{formatDate(certificate.expiration_date)}</p>
              </div>
            </div>
          </main>
        ))
      ) : (
        <p>No certificates expiring this month.</p>
      )}
    </div>
  );
};

export default HomeCertAdmin;