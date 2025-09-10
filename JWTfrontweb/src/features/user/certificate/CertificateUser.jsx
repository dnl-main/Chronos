// ✅ Added import for React Query
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // <-- added
import { setupTokenTimeout } from '../../../app/utils/authTimeout';

import Spinner from '../../../components/ui/Spinner';
import CertificateUserCard from './cards/CertificateUserCard';
import CertificatePopup from './modals/CertificatePopup';
import Cloud_Upload from '../../../assets/icons/Cloud_Upload.svg?react';

import './CertificateUser.css';
import './certificateUserMQ.css';

import NewCertUpload from './modals/NewCertUpload';

const CertificateUser = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const queryClient = useQueryClient(); // <-- added
  const [user, setUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const certPerPage = 4;

  // ✅ Fetch certificates using React Query instead of manual axios + state
  const token = sessionStorage.getItem('token');
  const {
    data: certificates = [], // certificates list
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}/certificates`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      return response.data.certificates || [];
    },
    enabled: !!token, // only run if token exists
  });

  // ✅ Keep user authentication check but remove old fetchCertificates call
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'user') {
        navigate('/login');
        return;
      }
      setUser(parsedUser);
    } else {
      fetchUserData(token);
    }

    setupTokenTimeout(token, storedUser ? JSON.parse(storedUser) : null, navigate);
  }, [navigate, token]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
      const userData = response.data;
      if (userData.role !== 'user') {
        navigate('/login');
        return;
      }
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError('Failed to fetch user data');
      navigate('/login');
    }
  };

  const handleDelete = async (certificateId) => {
    if (!token) {
      navigate('/login');
      return;
    }

    setDeleteLoading(true);
    setError(null);

    try {
      await axios.post(
        `${apiUrl}/certificates/delete`,
        { id: certificateId },
        { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } }
      );
      // ✅ Instead of calling fetchCertificates, just invalidate the query
      queryClient.invalidateQueries(['certificates']);
      alert('Certificate deleted successfully');
    } catch (error) {
      console.error('Failed to delete certificate:', error);
      setError('Failed to delete certificate');
      alert(error.response?.data.message || 'Failed to delete certificate');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFileClick = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const closePopup = () => {
    setSelectedCertificate(null);
  };

  // ✅ Pagination logic stays the same
  const indexOfLastCert = currentPage * certPerPage;
  const indexOfFirstCert = indexOfLastCert - certPerPage;
  const currentCerts = certificates.slice(indexOfFirstCert, indexOfLastCert);
  const totalPages = Math.ceil(certificates.length / certPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [certificates, currentPage, totalPages]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // ✅ Replace old loading/error with React Query state
  if (isLoading) {
    return <Spinner />;
  }

  if (isError || error) {
    return <p className="error">{error || 'Failed to fetch certificates'}</p>;
  }

  return (
    <div className="certificateUser">
      <div className="certificateUser-box">
        <main className="certificateUser-box-in">
          <div className="certificateUser-top">
            <div className="certificateUser-top-header">
              <div className="certificateUser-top-header-left">
                <Cloud_Upload
                  style={{
                    width: '1.8rem',
                    height: '1.8rem',
                    '--stroke-color': 'var(--black-color-opacity-60)',
                    '--stroke-width': '6px',
                    '--fill-color': 'none',
                  }}
                />
                <header>Certificates</header>
              </div>

              {/* ✅ No need to manually refresh, React Query auto-refetches */}
              <NewCertUpload />
            </div>
            <div className="certificateUser-top-core">
              <p className="certificateUser-top-core-medium">List of certificates</p>
              <div className="certificateUser-top-core-cards"
              style={{
    justifyContent: currentCerts.length === 4 ? 'space-between' : 'flex-start',
    columnGap: currentCerts.length < 4 ? '1.4rem' : '0', // apply gap only when <4
  }}
              >
                {deleteLoading ? (
                  <div className="certificateUser-spinner">
                    <Spinner />
                  </div>
                ) : currentCerts.length > 0 ? (
                  currentCerts.map((cert, index) => (
                    <CertificateUserCard
                      key={cert.id || index}
                      certificate={cert}
                      onFileClick={() => handleFileClick(cert)}
                      onDelete={() => handleDelete(cert.id)}
                    />
                  ))
                ) : (
                  <p className="certificateUser-empty-message">
                    No certificates available.
                  </p>
                )}
              </div>
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-button prev-next"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="pagination-button prev-next"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}

            </div>
          </div>
          <div className="certificateUser-bot"></div>
        </main>
      </div>
      {selectedCertificate && <CertificatePopup certificate={selectedCertificate} onClose={closePopup} />}
    </div>
  );
};

export default CertificateUser;
