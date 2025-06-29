import React from 'react';
import './certificateUserCard.css';
import './certificateUserCardMQ.css';
import House_Add from '../../../../assets/icons/House_Add.svg?react';
import Calendar_Week from '../../../../assets/icons/Calendar_Week.svg?react';
import File_Add from '../../../../assets/icons/File_Add.svg?react';
import Trash from '../../../../assets/icons/Trash.svg?react';

const CertificateUserCard = ({ certificate, onFileClick, onDelete }) => {
  const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';

    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase(); // e.g., NOV
    const day = date.getDate().toString().padStart(2, '0'); // ensures 2-digit day, e.g., 11
    const year = date.getFullYear(); // e.g., 2023

    return `${month} - ${day} - ${year}`;
  } catch (error) {
    // console.error('Error formatting date:', dateString, error);
    return 'N/A';
  }
};

  return (
    <main className="certificateUser-top-core-cards-card">
      <div className="certificateUser-top-core-cards-card-up">
        <div className="certificateUser-top-core-cards-card-up-header">
          <House_Add
            style={{
              width: '1.4rem',
              height: '1.4rem',
              '--stroke-color': 'var(--black-color-opacity-60)',
              '--stroke-width': '6px',
              '--fill-color': 'none',
            }}
          />
          <header>{certificate.certificate_type}</header>
        </div>
        <div className="certificateUser-top-core-cards-card-up-expiry">
          <p className="certificateUser-top-core-cards-card-up-expiry-semibold">Expiration date</p>
          <div className="certificateUser-top-core-cards-card-up-expiry-btn">
            <div className="certificateUser-top-core-cards-card-up-expiry-btn-box">
              <Calendar_Week
                style={{
                  width: '1.8rem',
                  height: '1.8rem',
                  '--stroke-color': 'var(--black-color-opacity-60)',
                  '--stroke-width': '2px',
                  '--fill-color': 'none',
                }}
              />
              <div className="certificateUser-top-core-cards-card-up-expiry-btn-box-text">
                <p className="certificateUser-top-core-cards-card-up-expiry-btn-box-text-light">Expiry date</p>
                <p className="certificateUser-top-core-cards-card-up-expiry-btn-box-text-bold">
                  {certificate.expiration_date ? formatDate(certificate.expiration_date) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="certificateUser-top-core-cards-card-down">

        <div className="certificateUser-top-core-cards-card-down-upload">
          <div className="certificateUser-top-core-cards-card-down-text">
            <div className="certificateUser-top-core-cards-card-down-text-bold">
              <File_Add
                style={{
                  width: '1.4rem',
                  height: '1.4rem',
                  '--stroke-color': 'var(--black-color-opacity-60)',
                  '--stroke-width': '6px',
                  '--fill-color': 'none',
                }}
              />
              <p>Uploaded file</p>
            </div>
          </div>
          <div
            className="certificateUser-top-core-cards-card-down-btn"
            onClick={onFileClick}
            style={{ cursor: 'pointer' }}
          >
            <p style={{ color: 'blue', textDecoration: 'underline', pointerEvents: 'none' }}>
              {certificate.file_path ? certificate.file_path.split('/').pop() : 'No file uploaded'}
            </p>
          </div>
        </div>

        <div className="certificateUser-top-core-cards-card-down-delete">
          <div className="certificateUser-top-core-cards-card-down-text">
            <div className="certificateUser-top-core-cards-card-down-text-bold">
              <Trash
                style={{
                  width: '1.4rem',
                  height: '1.4rem',
                  '--stroke-color': 'var(--black-color-opacity-60)',
                  '--stroke-width': '6px',
                  '--fill-color': 'none',
                }}
              />
              <p>Delete file</p>
            </div>
          </div>
          <div className="certificateUser-top-core-cards-card-down-btn"
            onClick={onDelete}
            style={{ cursor: 'pointer' }}>
            <p
              className="certificateUser-top-core-cards-card-down-delete-btn"
              style={{ cursor: 'pointer', color: 'red', textDecoration: 'underline', marginLeft: '1px' }}
            >
              Delete
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CertificateUserCard;