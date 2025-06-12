import React from 'react';
import './certificateModal.css';
import CertificateModalCard from './CertificateModalCard';
import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Close_MD from '../../assets/icons/Close_MD.svg?react';
import Book from '../../assets/icons/Book.svg?react';

const CertificateModal = () => {
  return (
    <div className="certificateModal">
    <div className="certificateModal-box">
    <div className="certificateModal-box-in">
      <div className="certificateModal-box-in-header">
        <div className="certificateModal-box-in-header-heading">
          <Book style={{ color: "var(--black-color-opacity-45)", width: "32px", height: "32px", '--stroke-width': '4px' }} />
          <p>Certificate list</p>
        </div> {/* certificateModal-box-in-header-heading */}

        <div className="certificateModal-box-in-header-close">
          <button className="certificateModal-box-in-header-close-button">
            <Close_MD style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
          </button>
        </div>
      </div> {/* certificateModal-box-in-header */}

      <div className="certificateModal-box-in-core">
        <div className="certificateModal-box-in-core-tabs">
          <button className="certificateModal-box-in-core-tabs-all">
            <Circle_Primary style={{ color: "var(--primary-color)", width: "1.8rem", height: "1.8rem" }} />
            <p>All</p>
          </button> {/* certificateModal-box-in-core-tabs-all */}

          <button className="certificateModal-box-in-core-tabs-approved">
            <Circle_Primary style={{ color: "var(--green-indicator)", width: "1.8rem", height: "1.8rem" }} />
            <p>Approved</p>
          </button> {/* certificateModal-box-in-core-tabs-approves */}

          <button className="certificateModal-box-in-core-tabs-pending">
            <Circle_Primary style={{ color: "var(--yellow-indicator)", width: "1.8rem", height: "1.8rem" }} />
            <p>Pending</p>
          </button> {/* certificateModal-box-in-core-tabs-required */}

          <button className="certificateModal-box-in-core-tabs-required">
            <Circle_Primary style={{ color: "var(--red-indicator)", width: "1.8rem", height: "1.8rem" }} />
            <p>Required</p>
          </button> {/* certificateModal-box-in-core-tabs-required */}
        </div> {/* certificateModal-box-in-core-tabs */}

        <div className="certificateModal-box-in-core-cards">
          <CertificateModalCard />
          <CertificateModalCard />
          <CertificateModalCard />
        </div> {/* certificateModal-box-in-core-cards */}
      </div> {/* certificateModal-box-in-core */}
    </div> {/* certificateModal-box-in */}
    </div> {/* certificateModal-box */}
    </div> // certificateModal
  );
};

export default CertificateModal;