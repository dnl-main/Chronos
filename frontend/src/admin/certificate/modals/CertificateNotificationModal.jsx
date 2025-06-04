import React from 'react';
import './certificateNotificationModal.css';
import Message_Received from '../../../assets/icons/Message_Received.svg?react';

const CertificateNotificationModal = ({ onClose }) => {
  return (
    <div className="certNotifModal">
      <div className="certNotifModal-box">
        <div className="certNotifModal-box-in">
          <p className="certNotifModal-box-in-bold">Notification sent</p>
          <p className="certNotifModal-box-in-light">
            We've sent them a reminder to <br /> upload their certificate
          </p>
          <Message_Received
            style={{
              width: '24vh',
              height: '24vh',
            }}
          />
          <button className="certNotifModal-box-in-btn" onClick={onClose}>
            <p>Okay</p>
          </button>
        </div> {/* certNotifModal-box-in */}
      </div> {/* certNotifModal-box */}
    </div>
  );
};

export default CertificateNotificationModal;