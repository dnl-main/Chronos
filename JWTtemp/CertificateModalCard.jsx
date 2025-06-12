import React from 'react';
import './certificateModalCard.css';
import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Check from '../../assets/icons/Check.svg?react';
import Close_MD from '../../assets/icons/Close_MD.svg?react';
import Note_Search from '../../assets/icons/Note_Search.svg?react';

const CertificateModalCard = () => {
  return (
    <main className="certificateModal-box-in-core-cards-card">
      <div className="certificateModal-box-in-core-cards-card-indicator">
        
      </div> {/* certificateModal-box-in-core-cards-card-indicator */}

      <div className="certificateModal-box-in-core-cards-card-file">
        <div className="certificateModal-box-in-core-cards-card-file-preview">
          <button className="certificateModal-box-in-core-cards-card-file-preview-button">
            <Note_Search 
              style={{ 
                color: "var(--primary-color)", 
                width: "2rem", 
                height: "2rem", 
                "--stroke-width": "6px" 
              }} 
            />
          </button> {/* certificateModal-box-in-core-cards-card-file-preview-button */}
        </div> {/* certificateModal-box-in-core-cards-card-file-preview */}

        <div className="certificateModal-box-in-core-cards-card-file-separator">
          
        </div> {/* certificateModal-box-in-core-cards-card-file-separator */}

        <div className="certificateModal-box-in-core-cards-card-file-pdf">
          <p className="certificateModal-box-in-core-cards-card-file-pdf-regular">FileName.pdf</p>
          <div className="certificateModal-box-in-core-cards-card-file-pdf-box">
            <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
            <p>Training</p>
          </div> {/* certificateModal-box-in-core-cards-card-file-pdf-box */}
        </div> {/* certificateModal-box-in-core-cards-card-file-pdf */}
      </div> {/* certificateModal-box-in-core-cards-card-file */}

      <div className="certificateModal-box-in-core-cards-card-expiry">
        <div className="certificateModal-box-in-core-cards-card-expiry-separator">
        </div> {/* certificateModal-box-in-core-cards-card-expiry-separator */}
        <div className="certificateModal-box-in-core-cards-card-expiry-text">
          <div className="certificateModal-box-in-core-cards-card-expiry-text-exclude">
            <p className="certificateModal-box-in-core-cards-card-expiry-text-exclude-light">Expiration date</p>
            <p className="certificateModal-box-in-core-cards-card-expiry-text-exclude-bold">JUL - 12 - 2025</p>
          </div> {/* certificateModal-box-in-core-cards-card-expiry-text-excclude */}
          <p className="certificateModal-box-in-core-cards-card-expiry-text-regular">Specifictype of cert</p>
        </div> {/* certificateModal-box-in-core-cards-card-expiry-text */}
      </div> {/* certificateModal-box-in-core-cards-card-expiry */}

      <div className="certificateModal-box-in-core-cards-card-status">
        <div className="certificateModal-box-in-core-cards-card-status-container">
          <Circle_Primary style={{ color: "var(--green-indicator)", width: "20px", height: "20px" }} />
          <p>Approved</p>
        </div>
      </div> {/* certificateModal-box-in-core-cards-card-status */}

      <div className="certificateModal-box-in-core-cards-card-buttons">
        <button className="certificateModal-box-in-core-cards-card-buttons-decline">
          <Close_MD
            style={{
              width: '30px',
              height: '30px',
              '--stroke-color': 'var(--primary-color)',
              '--stroke-width': '4px',
              '--fill-color': 'none',
            }}
          />
        </button> {/* certificateModal-box-in-core-cards-card-buttons-decline */}

        <button className="certificateModal-box-in-core-cards-card-buttons-approve">
          <Check style={{ color: "var(--white-color)", width: "1.8rem", height: "1.8rem" }} />
        </button> {/* certificateModal-box-in-core-cards-card-buttons-approve */}
      </div> {/* certificateModal-box-in-core-cards-card-buttons */}
    </main> 
  );
};

export default CertificateModalCard;