import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './certificate.css';
import { Navbar } from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import CertificateCard from './cards/CertificateCard';
import CertificatePopup from './CertificatePopup'; // Import the popup component
import Spinner from '../../components/Spinner';
import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Notebook from '../../assets/icons/Notebook.svg?react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Certificate = () => {
  const [overlayContent, setOverlayContent] = useState(null);
  const [user, setUser] = useState(null);
  const [crewData, setCrewData] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState(null); // State for popup
  const navigate = useNavigate();

  // Close popup handler
  const handleClosePopup = () => {
    setSelectedCertificate(null);
  };

  // Certificate selection handler
  const handleCertificateClick = (certificate) => {
    setSelectedCertificate(certificate);
  };

  useEffect(() => {

    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');



    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'admin') {
          navigate(parsedUser.role === 'user' ? '/user/homeuser' : '/login');
          return;
        }
        setUser(parsedUser);

        Promise.all([fetchCrewData(token), fetchCertificates(token)])
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error in Promise.all:', error);
            setError('Failed to load data.');
            setLoading(false);
          });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        navigate('/login');
        setLoading(false);
      }
    } else {
      fetchUserData(token);
    }
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {

      const response = await axios.get(`${apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const userData = response.data;
      if (userData.role !== 'admin') {

        navigate(userData.role === 'user' ? '/user/homeuser' : '/login');
        return;
      }
      sessionStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
   
      await Promise.all([fetchCrewData(token), fetchCertificates(token)]);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError('Failed to load user data. Please log in again.');
      navigate('/login');
    } finally {
  
      setLoading(false);
    }
  };

  const fetchCrewData = async (token) => {
    try {

      setError(null);
      const response = await axios.get(`${apiUrl}/crew-members`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setCrewData(Array.isArray(response.data) ? response.data : [response.data].filter(Boolean));
    } catch (error) {
      console.error('Failed to fetch crew data:', error);
      if (error.response?.status === 401) {
 
        setError('Unauthorized. Please log in again.');
        navigate('/login');
      } else {
        setError('Failed to load crew data.');
      }
    }
  };

  const fetchCertificates = async (token) => {
    try {
 
      const response = await axios.get(`${apiUrl}/certificates`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
 
      setCertificates(
        Array.isArray(response.data.certificates)
          ? response.data.certificates
          : [response.data.certificates].filter(Boolean)
      );
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      setError('Failed to load certificates.');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="certificate-error">{error}</div>;

  const tabs = ['all', 'complete', 'incomplete'];

  const filteredCrew = crewData.filter((crew) => {
    const memberCertificates = certificates.filter((cert) => cert.user_id === crew.id);
    const certificateTypes = new Set(memberCertificates.map((cert) => cert.certificate_type));
    const hasAllTypes = ['Medical', 'Training', 'Contract', 'Employee ID'].every((type) =>
      certificateTypes.has(type)
    );

    if (selectedTab === 'all') return true;
    if (selectedTab === 'complete') {
      return (
        memberCertificates.length === 4 &&
        hasAllTypes &&
        memberCertificates.every((cert) => cert.expiration_date)
      );
    }
    if (selectedTab === 'incomplete') {
      return memberCertificates.length < 4 || !hasAllTypes || memberCertificates.some((cert) => !cert.expiration_date);
    }
    return true;
  });

  return (
    <div className="certificate">
      <div className="certificate-box">
        <main className="certificate-box-in">
          <header className="certificate-header">
            <Notebook
              style={{
                color: 'var(--black-color)',
                width: '32px',
                height: '32px',
                '--stroke-width': '4px',
              }}
            />
            <p>Certificate tracking</p>
          </header>

          <section className="certificate-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`certificate-tabs-${tab} ${selectedTab === tab ? 'active-tab' : ''}`}
                onClick={() => setSelectedTab(tab)}
              >
                <Circle_Primary
                  style={{
                    color: selectedTab === tab ? 'var(--white-color)' : 'var(--primary-color)',
                    width: '20px',
                    height: '20px',
                  }}
                />
                <p>{tab.charAt(0).toUpperCase() + tab.slice(1)}</p>
              </button>
            ))}
          </section>

          <section className="certificate-categories">
            <p>Name and position</p>
            <p>Medical</p>
            <p>Training</p>
            <p>Contract</p>
            <p>Employee ID</p>
          </section>

          <section className="certificate-cards">
            {filteredCrew.map((crew) => (
              <CertificateCard
                key={crew.id}
                data={crew}
                certificates={certificates.filter((cert) => cert.user_id === crew.id)}
                onCertificateClick={handleCertificateClick} // Pass callback
              />
            ))}
          </section>
        </main>
      </div>
      {/* Render the CertificatePopup */}
      <CertificatePopup certificate={selectedCertificate} onClose={handleClosePopup} />
    </div>
  );
};

export default Certificate;