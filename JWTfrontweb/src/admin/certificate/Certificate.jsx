import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './certificate.css';
import { Navbar } from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import CertificateCard from './cards/CertificateCard';
import CertificatePopup from './CertificatePopup';
import CertificateNotificationModal from './modals/CertificateNotificationModal';
import CertificateModal from './CertificateModal';
import Spinner from '../../components/Spinner';
import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Notebook from '../../assets/icons/Notebook.svg?react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Certificate = () => {
  const [user, setUser] = useState(null);
  const [certificateData, setCertificateData] = useState([]);
  const [filteredCertificateData, setFilteredCertificateData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  const handleClosePopup = () => {
    setSelectedCertificate(null);
  };

  const handleCertificateClick = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleOpenNotificationModal = () => {
    console.log('Opening Notification Modal');
    setIsNotificationModalOpen(true);
  };

  const handleCloseNotificationModal = () => {
    console.log('Closing Notification Modal');
    setIsNotificationModalOpen(false);
  };

  const handleNotify = (data) => {
    console.log('Notify Data:', data);
    handleCloseNotificationModal();
  };

  const handleOpenCertificateModal = (userId) => {
    console.log('Opening CertificateModal for user_id:', userId);
    setSelectedUserId(userId);
    setIsCertificateModalOpen(true);
  };

  const handleCloseCertificateModal = () => {
    console.log('Closing CertificateModal');
    setIsCertificateModalOpen(false);
    setSelectedUserId(null);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredData = certificateData.filter(
      (data) =>
        data.user_name.toLowerCase().includes(query) ||
        data.position.toLowerCase().includes(query)
    );
    setFilteredCertificateData(filteredData);
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
        fetchCrewCerts(token);
      } catch (error) {
        console.error('Parse User Error:', error);
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
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
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
      fetchCrewCerts(token);
    } catch (error) {
      console.error('Fetch User Error:', error.response?.data || error.message);
      setError('Failed to load user data. Please log in again.');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchCrewCerts = async (token) => {
    try {
      setError(null);
      const response = await axios.get(`${apiUrl}/crew-certs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });

      console.log('Crew Certs API Response:', response.data);

      const crewMembers = Array.isArray(response.data.crew_members)
        ? response.data.crew_members.map(item => {
            console.log('Mapping crew member:', item);
            return {
              user_id: item.user_id,
              user_name: item.user_name || 'Unknown',
              position: item.position || 'N/A',
              total_uploaded: item.total_uploaded || 0,
              approved: item.approved || 0,
              pending: item.pending || 0,
              certificates: Array.isArray(item.certificates) ? item.certificates : [],
            };
          })
        : [];

      console.log('Processed certificateData:', crewMembers);
      setCertificateData(crewMembers);
      setFilteredCertificateData(crewMembers);
      setLoading(false);
    } catch (error) {
      console.error('Fetch Crew Certs Error:', error.response?.data || error.message);
      setError('Failed to load crew certificates.');
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="certificate-error">{error}</div>;

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

          <section className="certificate-categories" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>Name and position</p>
            <input
              type="text"
              placeholder="Search by name or position"
              value={searchQuery}
              onChange={handleSearch}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                width: '200px',
              }}
            />
          </section>

          <section className="certificate-cards">
            {filteredCertificateData.length === 0 ? (
              <p>No crew members found.</p>
            ) : (
              filteredCertificateData.map((data, index) => {
                console.log('Rendering card for:', data);
                return (
                  <CertificateCard
                    key={data.user_id || `card-${index}`}
                    data={data}
                    certificates={data.certificates}
                    onCertificateClick={handleCertificateClick}
                    onNotifyUpload={handleOpenNotificationModal}
                    onOpenCertificateModal={() => handleOpenCertificateModal(data.user_id)}
                  />
                );
              })
            )}
          </section>
        </main>
      </div>
      <CertificatePopup certificate={selectedCertificate} onClose={handleClosePopup} />
      {isNotificationModalOpen && (
        <CertificateNotificationModal
          onClose={handleCloseNotificationModal}
          onNotify={handleNotify}
        />
      )}
      {isCertificateModalOpen && (
        <CertificateModal
          userId={selectedUserId}
          onClose={handleCloseCertificateModal}
        />
      )}
    </div>
  );
};

export default Certificate;