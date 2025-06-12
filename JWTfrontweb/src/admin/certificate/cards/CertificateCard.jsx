import React from 'react';
import './certificateCard.css';

import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import Calendar_Add from '../../../assets/icons/Calendar_Add.svg?react';
import Notebook from '../../../assets/icons/Notebook.svg?react';
import Bell from '../../../assets/icons/Bell.svg?react';
import More_Horizontal from '../../../assets/icons/More_Horizontal.svg?react';
import Note_Search from '../../../assets/icons/Note_Search.svg?react';

const CertificateCard = ({ data, certificates = [], onCertificateClick, onNotifyUpload, onOpenCertificateModal }) => {
  const handleOpenModal = () => {
    if (!data?.user_id) {
      console.error('No user_id provided in data:', data);
      return;
    }
    if (onOpenCertificateModal) {
      onOpenCertificateModal(data.user_id);
    }
  };

  return (
    <main className="certificate-cards-card">
      <section className="certificate-cards-card-indicator">
        {/* Placeholder for indicator */}
      </section>

      <section className="certificate-cards-card-profile">
        <Circle_Primary style={{ color: "var(--primary-color)", width: "72px", height: "72px" }} />
        <div className="certificate-cards-card-profile-info">
          <p className="certificate-cards-card-profile-info-text">{data?.user_name || 'N/A'}</p>
          <div className="certificate-cards-card-profile-info-job">
            <Circle_Primary style={{ color: "var(--primary-color)", width: "32px", height: "32px" }} />
            <p>{data?.position || 'N/A'}</p>
          </div>
        </div>
      </section>

      <section className="certificate-cards-card-certificates">
        <div className="certificate-cards-card-certificates-total">
          <div className="certificate-cards-card-certificates-total-sub">
            <div className="certificate-cards-card-certificates-total-sub-separator"></div>
            <div className="certificate-cards-card-certificates-total-sub-text">
              <p className="certificate-cards-card-certificates-total-sub-text-light">Total</p>
              <p className="certificate-cards-card-certificates-total-sub-text-medium">Upload</p>
            </div>
          </div>
          <div className="certificate-cards-card-certificates-total-count">
            <div className="certificate-cards-card-certificates-total-count-bg">
              <p>{data?.total_uploaded || 0}</p>
            </div>
          </div>
        </div>

        <div className="certificate-cards-card-certificates-approved">
          <div className="certificate-cards-card-certificates-approved-sub">
            <div className="certificate-cards-card-certificates-approved-sub-separator"></div>
            <div className="certificate-cards-card-certificates-approved-sub-text">
              <p className="certificate-cards-card-certificates-approved-sub-text-light">Total</p>
              <p className="certificate-cards-card-certificates-approved-sub-text-medium">Approved</p>
            </div>
          </div>
          <div className="certificate-cards-card-certificates-approved-count">
            <div className="certificate-cards-card-certificates-approved-count-bg">
              <p>{data?.approved || 0}</p>
            </div>
          </div>
        </div>

        <div className="certificate-cards-card-certificates-pending">
          <div className="certificate-cards-card-certificates-pending-sub">
            <div className="certificate-cards-card-certificates-pending-sub-separator"></div>
            <div className="certificate-cards-card-certificates-pending-sub-text">
              <p className="certificate-cards-card-certificates-total-sub-text-light">Total</p>
              <p className="certificate-cards-card-certificates-total-sub-text-medium">Pending</p>
            </div>
          </div>
          <div className="certificate-cards-card-certificates-pending-count">
            <div className="certificate-cards-card-certificates-pending-count-bg">
              <p>{data?.pending || 0}</p>
            </div>
          </div>
        </div>

        <div className="certificate-cards-card-certificates-notify">
          <div className="certificate-cards-card-certificates-notify-text">
            <p className="certificate-cards-card-certificates-notify-text-light">Send a</p>
            <p className="certificate-cards-card-certificates-notify-text-medium">Notification</p>
          </div>
          <button
            className="certificate-cards-card-certificates-notify-btn"
            onClick={() => onNotifyUpload && onNotifyUpload(data.user_id)}
            aria-label="Notify crew for certificate upload"
          >
            <p>Notify Crew</p>
            <div className="certificate-cards-card-certificates-notify-btn-icon">
              <Bell
                style={{
                  width: '1.4rem',
                  height: '1.4rem',
                  '--stroke-color': 'var(--primary-color)',
                  '--stroke-width': '4',
                  '--fill-color': 'none',
                }}
              />
            </div>
          </button>
        </div>
      </section>

      <section className="certificate-cards-card-button">
        <button
          onClick={handleOpenModal}
          aria-label="View certificate list"
        >
          <More_Horizontal
            style={{
              width: '32px',
              height: '32px',
              '--stroke-color': 'var(--white-color)',
              '--stroke-width': '4px',
              '--fill-color': 'var(--white-color)',
            }}
          />
        </button>
      </section>
    </main>
  );
};

export default CertificateCard;