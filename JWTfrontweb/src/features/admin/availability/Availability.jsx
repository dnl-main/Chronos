//Dependencies import 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//Components import 
import AvailabilityCard from './cards/AvailabilityCard';
import Spinner from '../../../components/ui/Spinner';
import Appointment from '../components/modals/appointment/manageAppointment/Appointment';

//CSS Import 
import './availability.css';

//Icon import 
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import Users from '../../../assets/icons/Users.svg?react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Availability = () => {
  const [overlayContent, setOverlayContent] = useState(null);
  const [use, setUser] = useState(null);
  const [crewData, setCrewData] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQueryAll, setSearchQueryAll] = useState('');
  const navigate = useNavigate();

  // Helper function to check if a member matches a search query
  const matchesSearchQuery = (member, query) => {
    if (!query) return true;
    const fullName = ((member.first_name || '') + ' ' + (member.last_name || '')).toLowerCase();
    const position = (member.position || '').toLowerCase();
    return fullName.includes(query.toLowerCase()) || position.includes(query.toLowerCase());
  };

  // Process crew data with certificate status and approved count
  const processedCrewData = crewData.map((member) => {
    const memberCertificates = certificates.filter((cert) => cert.user_id === member.id);
    const certificateTypes = new Set(memberCertificates.map((cert) => cert.certificate_type));
    const requiredTypes = ['Medical', 'Training', 'Contract', 'Employee ID'];
    const hasAllCertificates = requiredTypes.every((type) => certificateTypes.has(type));
    const allValid = memberCertificates.every((cert) => cert.expiration_date && new Date(cert.expiration_date) >= new Date());
    const approvedCertificates = memberCertificates.filter((cert) => cert.status?.toLowerCase() === 'approved').length;

    return {
      ...member,
      completionStatus: hasAllCertificates && allValid ? 'Complete' : 'Incomplete',
      completionColor: hasAllCertificates && allValid ? 'var(--green-indicator)' : 'var(--red-indicator)',
      approvedCertificates,
    };
  });

  // Filter crew data for Available section based on global search query
  const filteredCrewDataAvailable = processedCrewData.filter((member) =>
    member.availability?.toLowerCase() === 'available' &&
    matchesSearchQuery(member, searchQueryAll)
  );

  // Filter crew data for Vacation section based on global search query
  const filteredCrewDataVacation = processedCrewData.filter((member) =>
    member.availability?.toLowerCase() === 'vacation' &&
    matchesSearchQuery(member, searchQueryAll)
  );

  // Filter crew data for On Board section based on global search query
  const filteredCrewDataOnBoard = processedCrewData.filter((member) =>
    member.availability?.toLowerCase() === 'on board' &&
    matchesSearchQuery(member, searchQueryAll)
  );

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
      await Promise.all([fetchCrewData(token), fetchCertificates(token)]);
    } catch (error) {
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
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      const crew = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
      setCrewData(crew);
    } catch (error) {
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
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      const certs = Array.isArray(response.data.certificates)
        ? response.data.certificates
        : [response.data.certificates].filter(Boolean);
      setCertificates(certs);
    } catch (error) {
      setError('Failed to load certificates.');
    }
  };

  const handleOpenAppointment = (userId) => {
    setSelectedUserId(userId);
    setShowAppointmentModal(true);
  };

  const handleCloseAppointment = () => {
    setShowAppointmentModal(false);
    setSelectedUserId(null);
  };

  if (loading) return <Spinner />;
  if (error) return <div className="availability-error">{error}</div>;

  const tabs = ['all', 'available', 'vacation', 'on board'];
  return (
    <div className="availability">
      <div className="availability-box">
        <main className="availability-box-in">
          <header className="availability-box-in-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Users style={{ width: '32px', height: '32px', color: '#14181f', strokeWidth: 2 }} />
              <p style={{ marginLeft: '8px' }}>Crew availability</p>
            </div>
            <input
              type="text"
              placeholder="Search all crew by name or position"
              value={searchQueryAll}
              onChange={(e) => setSearchQueryAll(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid var(--black-color-opacity-30)',
                fontSize: '14px',
                width: '200px',
              }}
            />
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
              <header className="availability-box-in-header">
                <p>Available</p>
              </header>
              <section className="availability-box-in-cards">
                {filteredCrewDataAvailable.length === 0 ? (
                  <p>No available crew members found.</p>
                ) : (
                  filteredCrewDataAvailable.map((member) => (
                    <AvailabilityCard
                      key={member.id}
                      data={member}
                      onOpenAppointment={handleOpenAppointment}
                    />
                  ))
                )}
              </section>
            </>
          )}

          {/* Vacation Section */}
          {(selectedTab === 'all' || selectedTab === 'vacation') && (
            <>
              <header className="availability-box-in-header">
                <p>Vacation</p>
              </header>
              <section className="availability-box-in-cards">
                {filteredCrewDataVacation.length === 0 ? (
                  <p>No vacation crew members found.</p>
                ) : (
                  filteredCrewDataVacation.map((member) => (
                    <AvailabilityCard
                      key={member.id}
                      data={member}
                      onOpenAppointment={handleOpenAppointment}
                    />
                  ))
                )}
              </section>
            </>
          )}

          {/* On Board Section */}
          {(selectedTab === 'all' || selectedTab === 'on board') && (
            <>
              <header className="availability-box-in-header">
                <p>On Board</p>
              </header>
              <section className="availability-box-in-cards">
                {filteredCrewDataOnBoard.length === 0 ? (
                  <p>No on board crew members found.</p>
                ) : (
                  filteredCrewDataOnBoard.map((member) => (
                    <AvailabilityCard
                      key={member.id}
                      data={member}
                      onOpenAppointment={handleOpenAppointment}
                    />
                  ))
                )}
              </section>
            </>
          )}
        </main>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="appointment-modal-overlay">
          <Appointment
            onClose={handleCloseAppointment}
            userId={selectedUserId}
          />
        </div>
      )}
    </div>
  );
};

export default Availability;