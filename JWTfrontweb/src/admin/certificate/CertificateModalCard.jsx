// src/components/CertificateModalCard.js
import React, { useState } from 'react';
import axios from 'axios';
import './certificateModalCard.css';
import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Check from '../../assets/icons/Check.svg?react';
import Close_MD from '../../assets/icons/Close_MD.svg?react';
import Note_Search from '../../assets/icons/Note_Search.svg?react';

const CertificateModalCard = ({ certificate, onCertificateClick, onStatusChange }) => {
  const { certificate_name, certificate_type, expiration_date, status } = certificate;
  const [error, setError] = useState(null);

  const formattedDate = expiration_date
    ? new Date(expiration_date).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).toUpperCase().replace(',', ' -')
    : 'N/A';

  const statusColor = {
    approved: 'var(--green-indicator)',
    pending: 'var(--yellow-indicator)',
    declined: 'var(--red-indicator)',
  }[status?.toLowerCase()] || 'var(--black-color-opacity-60)';

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleApprove = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/certificates/${certificate.id}/approve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      onStatusChange(response.data.certificate);
      alert(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve certificate');
    }
  };

  const handleDecline = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/certificates/${certificate.id}/decline`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      onStatusChange(response.data.certificate);
      alert(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to decline certificate');
    }
  };

  return (
    <main className="certificateModal-box-in-core-cards-card">
      <div className="certificateModal-box-in-core-cards-card-indicator">
        <Circle_Primary style={{ color: statusColor, width: "20px", height: "20px" }} />
      </div>
      <div className="certificateModal-box-in-core-cards-card-file">
        <div className="certificateModal-box-in-core-cards-card-file-preview">
          <button
            className="certificateModal-box-in-core-cards-card-file-preview-button"
            onClick={() => onCertificateClick(certificate)}
          >
            <Note_Search 
              style={{ 
                color: "var(--primary-color)", 
                width: "2rem", 
                height: "2rem", 
                "--stroke-width": "6px" 
              }} 
            />
          </button>
        </div>
        <div className="certificateModal-box-in-core-cards-card-file-separator"></div>
        <div className="certificateModal-box-in-core-cards-card-file-pdf">
          <p className="certificateModal-box-in-core-cards-card-file-pdf-regular">
            {certificate_name}.pdf
          </p>
          <div className="certificateModal-box-in-core-cards-card-file-pdf-box">
            <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
            <p>{certificate_type}</p>
          </div>
        </div>
      </div>
      <div className="certificateModal-box-in-core-cards-card-expiry">
        <div className="certificateModal-box-in-core-cards-card-expiry-separator"></div>
        <div className="certificateModal-box-in-core-cards-card-expiry-text">
          <div className="certificateModal-box-in-core-cards-card-expiry-text-exclude">
            <p className="certificateModal-box-in-core-cards-card-expiry-text-exclude-light">Expiration date</p>
            <p className="certificateModal-box-in-core-cards-card-expiry-text-exclude-bold">{formattedDate}</p>
          </div>
          <p className="certificateModal-box-in-core-cards-card-expiry-text-regular">{certificate_type}</p>
        </div>
      </div>
      <div className="certificateModal-box-in-core-cards-card-status">
        <div className="certificateModal-box-in-core-cards-card-status-container">
          <Circle_Primary style={{ color: statusColor, width: "20px", height: "20px" }} />
          <p>{status || 'Pending'}</p>
        </div>
      </div>
      <div className="certificateModal-box-in-core-cards-card-buttons">
        <button 
          className="certificateModal-box-in-core-cards-card-buttons-decline"
          onClick={handleDecline}
          disabled={status === 'approved' || status === 'declined'}
        >
          <Close_MD
            style={{
              width: '30px',
              height: '30px',
              '--stroke-color': 'var(--primary-color)',
              '--stroke-width': '4px',
              '--fill-color': 'none',
            }}
          />
        </button>
        <button 
          className="certificateModal-box-in-core-cards-card-buttons-approve"
          onClick={handleApprove}
          disabled={status === 'approved' || status === 'declined'}
        >
          <Check style={{ color: "var(--white-color)", width: "1.8rem", height: "1.8rem" }} />
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </main>
  );
};

export default CertificateModalCard;