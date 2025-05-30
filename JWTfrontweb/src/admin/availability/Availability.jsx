import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './availability.css';
import { Navbar } from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import AvailabilityCard from './availabilityComponents/AvailabilityCard';
import Spinner from '../../components/Spinner';
import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Users from '../../assets/icons/Users.svg?react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Availability = () => {
  const [overlayContent, setOverlayContent] = useState(null);
  const [user, setUser] = useState(null);
  const [crewData, setCrewData] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        navigate(parsedUser.role === 'user' ? '/user/homeuser' : '/login');
        return;
      }
      setUser(parsedUser);
      Promise.all([fetchCrewData(token), fetchCertificates(token)])
        .then(() => setLoading(false))
        .catch((error) => {
          // console.error('Error in Promise.all:', error);
          setError('Failed to load data.');
          setLoading(false);
        });
    } else {
      fetchUserData(token);
    }
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/user`, {
   headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true' // Add this to bypass ngrok warning
      },
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
      // console.error('Failed to fetch user data:', error);
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
       headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true' // Add this to bypass ngrok warning
      },
        withCredentials: true,
      });
      const crew = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
      setCrewData(crew);
    } catch (error) {
      // console.error('Failed to fetch crew data:', error);
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
headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true' // Add this to bypass ngrok warning
      },
        withCredentials: true,
      });
      const certs = Array.isArray(response.data.certificates)
        ? response.data.certificates
        : [response.data.certificates].filter(Boolean);
      // console.log('Certificates:', certs); // Debug log
      setCertificates(certs);
    } catch (error) {
      // console.error('Failed to fetch certificates:', error);
      setError('Failed to load certificates.');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="availability-error">{error}</div>;

  const tabs = ['all', 'available', 'vacation', 'on board'];

  // Process crew data with certificate status
  const processedCrewData = crewData.map((member) => {
    const memberCertificates = certificates.filter((cert) => cert.user_id === member.id);
    // console.log(`Certificates for ${member.id}:`, memberCertificates); // Debug log
    const certificateTypes = new Set(memberCertificates.map((cert) => cert.certificate_type));
    const requiredTypes = ['Medical', 'Training', 'Contract', 'Employee ID'];
    const hasAllCertificates = requiredTypes.every((type) => certificateTypes.has(type));
    const allValid = memberCertificates.every((cert) => cert.expiration_date && new Date(cert.expiration_date) >= new Date());

    return {
      ...member,
      completionStatus: hasAllCertificates && allValid ? 'Complete' : 'Incomplete',
      completionColor: hasAllCertificates && allValid ? 'var(--green-indicator)' : 'var(--red-indicator)',
    };
  });

  return (
    <div className="availability">
      <div className="availability-box">
        <main className="availability-box-in">
          <header className="availability-box-in-header">
            <Users style={{ width: '32px', height: '32px', color: '#14181f', strokeWidth: 2 }} />
            <p>Crew availability</p>
          </header>

          <section className="availability-box-in-tabs">
            {tabs.map((tab) => {
              const classSafeTab = tab.replace(/\s+/g, '-');
              return (
                <button
                  key={tab}
                  className={`availability-box-in-tabs-${classSafeTab} ${selectedTab === tab ? 'active-tab' : ''}`}
                  onClick={() => setSelectedTab(tab)}
                >
                  <Circle_Primary
                    style={{
                      color: selectedTab === tab ? '#ffffff' : (tab === 'all' ? '#00899A' : 'var(--primary-color)'),
                      width: '20px',
                      height: '20px',
                    }}
                  />
                  <p>{tab.charAt(0).toUpperCase() + tab.slice(1)}</p>
                </button>
              );
            })}
          </section>

          {/* Available Section */}
          {(selectedTab === 'all' || selectedTab === 'available') && (
            <>
              <header className="availability-box-in-header"><p>Available</p></header>
              <section className="availability-box-in-cards">
                {processedCrewData
                  .filter((member) => member.availability?.toLowerCase() === 'available')
                  .map((member) => (
                    <AvailabilityCard key={member.id} data={member} />
                  ))}
              </section>
            </>
          )}

          {/* Vacation Section */}
          {(selectedTab === 'all' || selectedTab === 'vacation') && (
            <>
              <header className="availability-box-in-header"><p>Vacation</p></header>
              <section className="availability-box-in-cards">
                {processedCrewData
                  .filter((member) => member.availability?.toLowerCase() === 'vacation')
                  .map((member) => (
                    <AvailabilityCard key={member.id} data={member} />
                  ))}
              </section>
            </>
          )}

          {/* On Board Section */}
          {(selectedTab === 'all' || selectedTab === 'on board') && (
            <>
              <header className="availability-box-in-header"><p>On Board</p></header>
              <section className="availability-box-in-cards">
                {processedCrewData
                  .filter((member) => member.availability?.toLowerCase() === 'on board')
                  .map((member) => (
                    <AvailabilityCard key={member.id} data={member} />
                  ))}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Availability;