import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './certificateModal.css';
import CertificateModalCard from './CertificateModalCard';
import CertificatePopup from './CertificatePopup';
import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Close_MD from '../../assets/icons/Close_MD.svg?react';
import Book from '../../assets/icons/Book.svg?react';

const CertificateModal = ({ userId, onClose }) => {
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!userId || isNaN(userId)) {
        console.error('Invalid userId:', userId);
        setError('Invalid user ID provided');
        setCertificates([]);
        return;
      }

      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          setError('Authentication token missing');
          return;
        }

        const response = await axios.get(`${apiUrl}/certificates?user_id=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
          withCredentials: true,
        });

        setCertificates(response.data.certificates || []);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch certificates:', error.response?.data || error.message);
        setError('Failed to load certificates');
        setCertificates([]);
      }
    };
    fetchCertificates();
  }, [apiUrl, userId]);

  const handleCertificateClick = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleDeleteCertificate = (certificateId) => {
    setCertificates(certificates.filter(cert => cert.id !== certificateId));
    setSelectedCertificate(null);
  };

  const filteredCertificates = certificates.filter(cert => {
    if (filter === 'all') return true;
    return cert.status?.toLowerCase() === filter;
  });

  return (
    <div className="certificateModal">
      <div className="certificateModal-box">
        <div className="certificateModal-box-in">
          <div className="certificateModal-box-in-header">
            <div className="certificateModal-box-in-header-heading">
              <Book style={{ color: "var(--black-color-opacity-45)", width: "32px", height: "32px", '--stroke-width': '4px' }} />
              <p>Certificate list</p>
            </div>
            <div className="certificateModal-box-in-header-close">
              <button
                className="certificateModal-box-in-header-close-button"
                onClick={onClose}
                aria-label="Close certificate modal"
              >
                <Close_MD style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
              </button>
            </div>
          </div>
          <div className="certificateModal-box-in-core">
            {error ? (
              <p className="certificateModal-error">{error}</p>
            ) : (
              <>
                <div className="certificateModal-box-in-core-tabs">
                  <button
                    className={`certificateModal-box-in-core-tabs-all ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    <Circle_Primary style={{ color: "var(--primary-color)", width: "1.8rem", height: "1.8rem" }} />
                    <p>All</p>
                  </button>
                  <button
                    className={`certificateModal-box-in-core-tabs-approved ${filter === 'approved' ? 'active' : ''}`}
                    onClick={() => setFilter('approved')}
                  >
                    <Circle_Primary style={{ color: "var(--green-indicator)", width: "1.8rem", height: "1.8rem" }} />
                    <p>Approved</p>
                  </button>
                  <button
                    className={`certificateModal-box-in-core-tabs-pending ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                  >
                    <Circle_Primary style={{ color: "var(--yellow-indicator)", width: "1.8rem", height: "1.8rem" }} />
                    <p>Pending</p>
                  </button>
                </div>
                <div className="certificateModal-box-in-core-cards">
                  {filteredCertificates.length > 0 ? (
                    filteredCertificates.map(cert => (
                      <CertificateModalCard
                        key={cert.id}
                        certificate={cert}
                        onCertificateClick={handleCertificateClick}
                        onDeleteCertificate={handleDeleteCertificate}
                      />
                    ))
                  ) : (
                    <p>No certificates available for this user</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {selectedCertificate && (
        <CertificatePopup
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
          onDelete={handleDeleteCertificate}
        />
      )}
    </div>
  );
};

export default CertificateModal;