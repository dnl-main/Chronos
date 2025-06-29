import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setupTokenTimeout } from '../../../app/utils/authTimeout';

import Spinner from '../../../components/ui/Spinner';
import CertificateUserCard from './cards/CertificateUserCard';
import CertificatePopup from './modals/CertificatePopup';
import Cloud_Upload from '../../../assets/icons/Cloud_Upload.svg?react';

import './CertificateUser.css';
import './certificateUserMQ.css';

const CertificateUser = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const certPerPage = 10;

    useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'user') {
        navigate('/login');
        return;
      }
      setUser(parsedUser);
      fetchCertificates(token);
    } else {
      fetchUserData(token);
    }

    setupTokenTimeout(token, storedUser ? JSON.parse(storedUser) : null, navigate);
  }, [navigate]);

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
      fetchCertificates(token);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError('Failed to fetch user data');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificates = async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/certificates`, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
      setCertificates(response.data.certificates || []);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      setError('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (certificateId) => {
    const token = sessionStorage.getItem('token');
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
      await fetchCertificates(token);
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

  // Pagination logic
  const indexOfLastCert = currentPage * certPerPage;
  const indexOfFirstCert = indexOfLastCert - certPerPage;
  const currentCerts = certificates.slice(indexOfFirstCert, indexOfLastCert);
  const totalPages = Math.ceil(certificates.length / certPerPage);

  // Adjust currentPage if it exceeds totalPages after certificates update
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

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="certificateUser">
      <div className="certificateUser-box">
        <main className="certificateUser-box-in">
          <div className="certificateUser-top">
            <div className="certificateUser-top-header">
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
            <div className="certificateUser-top-core">
              <p className="certificateUser-top-core-medium">List of certificates</p>
              <div className="certificateUser-top-core-cards" style={{ position: 'relative', minHeight: '200px' }}>
                {deleteLoading ? (
                  <Spinner />
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
                  <p
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '1.2rem',
                      color: '#555',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    No certificates available.
                  </p>
                )}
              </div>
              {totalPages > 1 && (
                <div className="pagination" style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    style={{
                      margin: '0 5px',
                      padding: '8px 12px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      backgroundColor: currentPage === 1 ? '#ccc' : '#00899A',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '1rem',
                    }}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      style={{
                        margin: '0 5px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        backgroundColor: currentPage === page ? '#00899A' : '#fff',
                        color: currentPage === page ? '#fff' : '#00899A',
                        border: '1px solid #00899A',
                        borderRadius: '1rem',
                      }}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    style={{
                      margin: '0 5px',
                      padding: '8px 12px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      backgroundColor: currentPage === totalPages ? '#ccc' : '#00899A',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '1rem',
                    }}
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
      {selectedCertificate && (
        <CertificatePopup certificate={selectedCertificate} onClose={closePopup} />
      )}
    </div>
  );
};

export default CertificateUser;