// Dependencies import
import React, { useReducer, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Components import
import AvailabilityCard from './cards/AvailabilityCard';
import Spinner from '../../../components/ui/Spinner';
import Appointment from '../components/modals/appointment/manageAppointment/Appointment';

// CSS import
import './availability.css';

// Icon import
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import Users from '../../../assets/icons/Users.svg?react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Reducer for state management
const initialState = {
  user: null,
  crewData: [],
  certificates: [],
  loading: true,
  error: null,
  selectedTab: 'all',
  showAppointmentModal: false,
  selectedUserId: null,
  searchQueryAll: '',
  overlayContent: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CREW_DATA':
      return { ...state, crewData: action.payload };
    case 'SET_CERTIFICATES':
      return { ...state, certificates: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SELECTED_TAB':
      return { ...state, selectedTab: action.payload };
    case 'SET_SHOW_APPOINTMENT_MODAL':
      return { ...state, showAppointmentModal: action.payload };
    case 'SET_SELECTED_USER_ID':
      return { ...state, selectedUserId: action.payload };
    case 'SET_SEARCH_QUERY_ALL':
      return { ...state, searchQueryAll: action.payload };
    case 'SET_OVERLAY_CONTENT':
      return { ...state, overlayContent: action.payload };
    default:
      return state;
  }
};

const Availability = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    user,
    crewData,
    certificates,
    loading,
    error,
    selectedTab,
    showAppointmentModal,
    selectedUserId,
    searchQueryAll,
    overlayContent,
  } = state;
  const navigate = useNavigate();

  // Helper function to check if a member matches a search query
  const matchesSearchQuery = useCallback((member, query) => {
    if (!query) return true;
    const fullName = ((member.first_name || '') + ' ' + (member.last_name || '')).toLowerCase();
    const position = (member.position || '').toLowerCase();
    return fullName.includes(query.toLowerCase()) || position.includes(query.toLowerCase());
  }, []);

  // Process crew data with certificate status and approved count
  const processedCrewData = useCallback(
    crewData.map((member) => {
      const memberCertificates = certificates.filter((cert) => cert.user_id === member.id);
      const certificateTypes = new Set(memberCertificates.map((cert) => cert.certificate_type));
      const requiredTypes = ['Medical', 'Training', 'Contract', 'Employee ID'];
      const hasAllCertificates = requiredTypes.every((type) => certificateTypes.has(type));
      const allValid = memberCertificates.every(
        (cert) => cert.expiration_date && new Date(cert.expiration_date) >= new Date()
      );
      const approvedCertificates = memberCertificates.filter(
        (cert) => cert.status?.toLowerCase() === 'approved'
      ).length;

      return {
        ...member,
        completionStatus: hasAllCertificates && allValid ? 'Complete' : 'Incomplete',
        completionColor: hasAllCertificates && allValid ? 'var(--green-indicator)' : 'var(--red-indicator)',
        approvedCertificates,
      };
    }),
    [certificates, crewData]
  );

  // Filter crew data based on selected tab and search query
  const filteredCrewDataAvailable = processedCrewData.filter(
    (member) => member.availability?.toLowerCase() === 'available' && matchesSearchQuery(member, searchQueryAll)
  );
  const filteredCrewDataVacation = processedCrewData.filter(
    (member) => member.availability?.toLowerCase() === 'vacation' && matchesSearchQuery(member, searchQueryAll)
  );
  const filteredCrewDataOnBoard = processedCrewData.filter(
    (member) => member.availability?.toLowerCase() === 'on board' && matchesSearchQuery(member, searchQueryAll)
  );

  // TanStack Query for fetching user data
  const { data: userData, isLoading: isUserLoading, isError: isUserError, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!sessionStorage.getItem('token'),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  // TanStack Query for fetching crew data
  const { data: crewDataResponse, isLoading: isCrewLoading, isError: isCrewError, error: crewError } = useQuery({
    queryKey: ['crewMembers'],
    queryFn: async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${apiUrl}/crew-members`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      return Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
    },
    enabled: !!user && user.role === 'admin',
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  // TanStack Query for fetching certificates
  const { data: certificatesData, isLoading: isCertificatesLoading, isError: isCertificatesError, error: certificatesError } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${apiUrl}/certificates`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      return Array.isArray(response.data.certificates)
        ? response.data.certificates
        : [response.data.certificates].filter(Boolean);
    },
    enabled: !!user && user.role === 'admin',
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  // Memoized callback functions
  const handleOpenAppointment = useCallback((userId) => {
    dispatch({ type: 'SET_SELECTED_USER_ID', payload: userId });
    dispatch({ type: 'SET_SHOW_APPOINTMENT_MODAL', payload: true });
  }, []);

  const handleCloseAppointment = useCallback(() => {
    dispatch({ type: 'SET_SHOW_APPOINTMENT_MODAL', payload: false });
    dispatch({ type: 'SET_SELECTED_USER_ID', payload: null });
  }, []);

  const handleTabChange = useCallback((tab) => {
    dispatch({ type: 'SET_SELECTED_TAB', payload: tab });
  }, []);

  const handleSearchQueryChange = useCallback((query) => {
    dispatch({ type: 'SET_SEARCH_QUERY_ALL', payload: query });
  }, []);

  const handleOverlayContent = useCallback((content) => {
    dispatch({ type: 'SET_OVERLAY_CONTENT', payload: content });
  }, []);

  // Handle authentication and data fetching
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'admin') {
          navigate(parsedUser.role === 'user' ? '/user/homeuser' : '/login');
          return;
        }
        dispatch({ type: 'SET_USER', payload: parsedUser });
      } catch (error) {
        console.error('Parse User Error:', error);
        navigate('/login');
        return;
      }
    }

    if (userData) {
      if (userData.role !== 'admin') {
        navigate(userData.role === 'user' ? '/user/homeuser' : '/login');
        return;
      }
      sessionStorage.setItem('user', JSON.stringify(userData));
      dispatch({ type: 'SET_USER', payload: userData });
    }

    if (crewDataResponse) {
      dispatch({ type: 'SET_CREW_DATA', payload: crewDataResponse });
    }

    if (certificatesData) {
      dispatch({ type: 'SET_CERTIFICATES', payload: certificatesData });
    }

    if (isUserError) {
      console.error('Fetch User Error:', userError.message);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data. Please log in again.' });
      navigate('/login');
    }

    if (isCrewError) {
      console.error('Fetch Crew Error:', crewError.message);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load crew data.' });
    }

    if (isCertificatesError) {
      console.error('Fetch Certificates Error:', certificatesError.message);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load certificates.' });
    }

    dispatch({ type: 'SET_LOADING', payload: isUserLoading || isCrewLoading || isCertificatesLoading });
  }, [
    navigate,
    userData,
    isUserLoading,
    isUserError,
    userError,
    crewDataResponse,
    isCrewLoading,
    isCrewError,
    crewError,
    certificatesData,
    isCertificatesLoading,
    isCertificatesError,
    certificatesError,
  ]);

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
              onChange={(e) => handleSearchQueryChange(e.target.value)}
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
                  onClick={() => handleTabChange(tab)}
                >
                  <Circle_Primary
                    style={{
                      color: selectedTab === tab ? '#ffffff' : tab === 'all' ? '#00899A' : 'var(--primary-color)',
                      width: '20px',
                      height: '20px',
                    }}
                  />
                  <p>{tab.charAt(0).toUpperCase() + tab.slice(1)}</p>
                </button>
              );
            })}
          </section>

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