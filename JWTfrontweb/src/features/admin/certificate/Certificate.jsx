import React, { useReducer, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useVirtualizer } from '@tanstack/react-virtual';
import { debounce } from 'lodash';

// Components import
import CertificateCard from './cards/CertificateCard';
import CertificatePopup from './modals/Popup/CertificatePopup';
import CertificateNotificationModal from './modals/notify/CertificateNotify';
import CertificateModal from './modals/view/CertificateView';
import Spinner from '../../../components/ui/Spinner';

// CSS import
import './certificate.css';

// Icon import
import Notebook from '../../../assets/icons/Notebook.svg?react';
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import DefaultDP from '../../../assets/photo/defaultdp.png'; 

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Reducer for state management
const initialState = {
  user: null,
  certificateData: [],
  loading: true,
  error: null,
  selectedCertificate: null,
  isNotificationModalOpen: false,
  isCertificateModalOpen: false,
  selectedUserId: null,
  selectedUserEmail: null,
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  isSearching: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CERTIFICATE_DATA':
      return { ...state, certificateData: action.payload, currentPage: 1 };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SELECTED_CERTIFICATE':
      return { ...state, selectedCertificate: action.payload };
    case 'SET_NOTIFICATION_MODAL_OPEN':
      return { ...state, isNotificationModalOpen: action.payload };
    case 'SET_CERTIFICATE_MODAL_OPEN':
      return { ...state, isCertificateModalOpen: action.payload };
    case 'SET_SELECTED_USER_ID':
      return { ...state, selectedUserId: action.payload };
    case 'SET_SELECTED_USER_EMAIL':
      return { ...state, selectedUserEmail: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload, currentPage: 1 };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_TOTAL_PAGES':
      return { ...state, totalPages: action.payload };
    case 'SET_IS_SEARCHING':
      return { ...state, isSearching: action.payload };
    default:
      return state;
  }
};

const Certificate = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    user,
    certificateData,
    loading,
    error,
    selectedCertificate,
    isNotificationModalOpen,
    isCertificateModalOpen,
    selectedUserId,
    selectedUserEmail,
    searchQuery,
    currentPage,
    totalPages,
    isSearching,
  } = state;
  const navigate = useNavigate();
  const parentRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const rowsPerPage = 10;

  // Debounced search handler with 1-second spinner delay
  const debouncedSearch = useCallback(
    debounce((value) => {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set searching state immediately
      dispatch({ type: 'SET_IS_SEARCHING', payload: true });

      // Set 1-second timeout for spinner
      searchTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: value });
        dispatch({ type: 'SET_IS_SEARCHING', payload: false });
      }, 1000); // 1-second delay
    }, 300),
    []
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Virtualization setup
  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count: certificateData.length,
    estimateSize: () => 170,
    overscan: 3,
    paddingStart: 20,
    paddingEnd: 20,
  });

  // Handle page change
  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
    }
  }, [totalPages]);

  // Memoized callback functions for button clicks
  const handleClosePopup = useCallback(() => {
    dispatch({ type: 'SET_SELECTED_CERTIFICATE', payload: null });
  }, []);

  const handleCertificateClick = useCallback((certificate) => {
    dispatch({ type: 'SET_SELECTED_CERTIFICATE', payload: certificate });
  }, []);

  const handleOpenNotificationModal = useCallback((userId, email) => {
    // console.log('Opening Notification Modal for user_id: ', userId, 'email: ', email);
    dispatch({ type: 'SET_SELECTED_USER_ID', payload: userId });
    if (!email || email === 'N/A') {
      dispatch({ type: 'SET_ERROR', payload: 'User email is not available.' });
      return;
    }
    dispatch({ type: 'SET_SELECTED_USER_EMAIL', payload: email });
    dispatch({ type: 'SET_NOTIFICATION_MODAL_OPEN', payload: true });
  }, []);

  const handleCloseNotificationModal = useCallback(() => {
    // console.log('Closing Notification Modal');
    dispatch({ type: 'SET_NOTIFICATION_MODAL_OPEN', payload: false });
    dispatch({ type: 'SET_SELECTED_USER_ID', payload: null });
    dispatch({ type: 'SET_SELECTED_USER_EMAIL', payload: null });
  }, []);

  const handleNotify = useCallback((data) => {
    // console.log('Notify Data:', { ...data, recipientEmail: selectedUserEmail });
    handleCloseNotificationModal();
  }, [selectedUserEmail, handleCloseNotificationModal]);

  const handleOpenCertificateModal = useCallback((userId) => {
    // console.log('Opening CertificateModal for user_id:', userId);
    dispatch({ type: 'SET_SELECTED_USER_ID', payload: userId });
    dispatch({ type: 'SET_CERTIFICATE_MODAL_OPEN', payload: true });
  }, []);

  const handleCloseCertificateModal = useCallback(() => {
    // console.log('Closing CertificateModal');
    dispatch({ type: 'SET_SELECTED_USER_ID', payload: null });
    dispatch({ type: 'SET_CERTIFICATE_MODAL_OPEN', payload: false });
  }, []);

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

  // TanStack Query for fetching crew certificates
  const { data: crewCertsData, isLoading: isCrewCertsLoading, isError: isCrewCertsError, error: crewCertsError } = useQuery({
    queryKey: ['crewCerts'],
    queryFn: async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${apiUrl}/crew-certs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!user && user.role === 'admin',
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

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
        // console.error('Parse User Error:', error);
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

    if (crewCertsData) {
      const crewMembers = Array.isArray(crewCertsData.crew_members)
        ? crewCertsData.crew_members.map(item => ({
            user_id: item.user_id,
            user_name: item.user_name || 'Unknown',
            email: item.email || 'N/A',
            position: item.position || 'N/A',
            profilePicture: item.profilePicture || DefaultDP, 
            total_uploaded: item.total_uploaded || 0,
            approved: item.approved || 0,
            pending: item.pending || 0,
            expired: item.expired || 0,
            certificates: Array.isArray(item.certificates) ? item.certificates : [],
          }))
        : [];
      // console.log('Processed certificateData: ', crewMembers);
      dispatch({ type: 'SET_CERTIFICATE_DATA', payload: crewMembers });
    }

    if (isUserError) {
      // console.error('Fetch User Error: ', userError.message);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data. Please log in again.' });
      navigate('/login');
    }
    if (isCrewCertsError) {
      dispatch({ type: 'SET_ERROR', payload: crewCertsError.message || 'Failed to load crew certificates.' });
    }

    dispatch({ type: 'SET_LOADING', payload: isUserLoading || isCrewCertsLoading });
  }, [navigate, userData, isUserLoading, isUserError, userError, crewCertsData, isCrewCertsLoading, isCrewCertsError, crewCertsError]);

  // Show spinner if initial loading or searching for more than 1 second
  if (loading || (isSearching && searchQuery)) {
    return <Spinner />;
  }

  if (error) return <div className='certificate-error'>{error}</div>;

  return (
    <div className="certificate">
      <div className="certificate-box">
        <main className="certificate-box-in">
          <header className="certificate-header">
            <Notebook style={{ color: 'var(--black-color)', width: '32px', height: '32px', '--stroke-width': '4px' }} />
            <p>Certificate tracking</p>
          </header>

          <section className="certificate-categories" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>Name and position</p>
            <input
              type="text"
              placeholder="Search by name or position"
              defaultValue={searchQuery}
              onChange={(e) => debouncedSearch(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid var(--black-color-opacity-30)',
                fontSize: '14px',
                width: '200px',
              }}
            />
          </section>

          <section className="certificate-cards" ref={parentRef} style={{ overflow: 'auto', minHeight: '600px', position: 'relative' }}>
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                <div
                  key={virtualRow.index}
                  style={{
                    height: `${virtualRow.size}px`,
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <CertificateCard
                    data={paginatedData[virtualRow.index]}
                    certificates={paginatedData[virtualRow.index]?.certificates}
                    onCertificateClick={handleCertificateClick}
                    onNotifyUpload={() => handleOpenNotificationModal(paginatedData[virtualRow.index].user_id, paginatedData[virtualRow.index].email)}
                    onOpenCertificateModal={() => handleOpenCertificateModal(paginatedData[virtualRow.index].user_id)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '12px 16px',
                  margin: '0 5px',
                  border: '1px solid var(--black-color-opacity-30)',
                  borderRadius: '50%',
                  background: currentPage === 1 ? '#e0e0e0' : '#24808c',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  color: 'white',
                }}
              >
                <Circle_Primary />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: '12px 16px',
                    margin: '0 5px',
                    border: '1px solid var(--black-color-opacity-30)',
                    borderRadius: '50%',
                    background: currentPage === page ? '#24808c' : '#ffffff',
                    color: currentPage === page ? 'white' : 'black',
                    cursor: 'pointer',
                  }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '12px 16px',
                  margin: '0 5px',
                  border: '1px solid var(--black-color-opacity-30)',
                  borderRadius: '50%',
                  background: currentPage === totalPages ? '#e0e0e0' : '#24808c',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  color: 'white',
                }}
              >
                <Circle_Primary />
              </button>
            </div>
          )}
        </main>
      </div>
      <CertificatePopup certificate={selectedCertificate} onClose={handleClosePopup} />
      {isNotificationModalOpen && (
        <CertificateNotificationModal
          onClose={handleCloseNotificationModal}
          onNotify={handleNotify}
          recipientEmail={selectedUserEmail}
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