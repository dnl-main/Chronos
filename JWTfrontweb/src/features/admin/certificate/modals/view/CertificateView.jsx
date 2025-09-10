import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import './certificateView.css';
import CertificateModalCard from '../view/cards/CertificateViewCard';
import CertificatePopup from '../Popup/CertificatePopup';
import Circle_Primary from '../../../../../assets/icons/Circle_Primary.svg?react';
import Close_MD from '../../../../../assets/icons/Close_MD.svg?react';
import Book from '../../../../../assets/icons/Book.svg?react';

const CertificateModal = ({ userId, onClose }) => {
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const queryClient = useQueryClient();

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

  useEffect(() => {
    fetchCertificates();
  }, [userId]);

  const handleCertificateClick = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const declineMutation = useMutation({
    mutationFn: async (certificateId) => {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/certificates/${certificateId}/decline`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['certificates', userId]);
      queryClient.invalidateQueries(['crewCerts']);
      fetchCertificates(); // Refresh certificates
    },
    onError: (error) => {
      console.error('Error declining certificate:', error);
      setError('Failed to decline certificate');
    },
  });

  const handleDeclineCertificate = async (certificateId) => {
    setSelectedCertificate(null); // Close popup immediately
    declineMutation.mutate(certificateId);
  };

  const handleStatusChange = async () => {
    await fetchCertificates(); // Refresh certificates after status change
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
                  <button
                    className={`certificateModal-box-in-core-tabs-rejected ${filter === 'rejected' ? 'active' : ''}`}
                    onClick={() => setFilter('rejected')}
                  >
                    <Circle_Primary style={{ color: "var(--orange-indicator)", width: "1.8rem", height: "1.8rem" }} />
                    <p>Rejected</p>
                  </button>
                  <button
                    className={`certificateModal-box-in-core-tabs-expired ${filter === 'expired' ? 'active' : ''}`}
                    onClick={() => setFilter('expired')}
                  >
                    <Circle_Primary style={{ color: "var(--red-indicator)", width: "1.8rem", height: "1.8rem" }} />
                    <p>Expired</p>
                  </button>
                </div>
                <div className="certificateModal-box-in-core-cards">
                  {filteredCertificates.length > 0 ? (
                    filteredCertificates.map(cert => (
                      <CertificateModalCard
                        key={cert.id}
                        certificate={cert}
                        onCertificateClick={handleCertificateClick}
                        onStatusChange={handleStatusChange}
                        onDeclineCertificate={handleDeclineCertificate}
                      />
                    ))
                  ) : (
                    <p>No certificates available for this filter</p>
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
          onDecline={handleDeclineCertificate}
        />
      )}
    </div>
  );
};

export default CertificateModal;