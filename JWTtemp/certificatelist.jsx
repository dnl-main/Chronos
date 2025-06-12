import { useState } from 'react';
import './certificatelist.css';

import Close_MD from '../../../assets/icons/Close_MD.svg?react';
import Edit_Pencil_Line_01 from '../../../assets/icons/Edit_Pencil_Line_01.svg?react';
import Notebook from '../../../assets/icons/Notebook.svg?react';
import Note_Search from '../../../assets/icons/Note_Search.svg?react';
import Check from '../../../assets/icons/Check.svg?react';

const CertificateCard = ({ name, date, status, onDelete, onConfirm, onApprove, onDecline }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleApprove = () => {
    onApprove(name);
    setIsEditing(false);
  };

  const handleDecline = () => {
    onDecline(name);
    setIsEditing(false);
  };

  return (
    <div className="manageAppointment-box-in-left-core-bot-cards-card-container">
      <div className={`manageAppointment-box-in-left-core-bot-cards-card-container-indicator ${status.toLowerCase()}`}>
      </div>
      <div className="manageAppointment-box-in-left-core-bot-cards-card-container-profile">
        <div className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-indicator">
          <Note_Search style={{ width: '2rem', height: '2rem'}} />
        </div>  
        <div className="manageAppointment-box-in-left-core-bot-cards-card-container-file">
          <p className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info-text">
            {name}
          </p>
          <p className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info-subtext">
            Training
          </p>
        </div>
      </div>
      <div className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info">
        <p className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info-subtext">
          Expiration Date
        </p>
        <p className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info-text">
          {date}
        </p>
        <p className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info-subtext">
          Specific Type of training cert
        </p>
      </div>
      <div className="manageAppointment-box-in-left-core-bot-cards-card-container-availability">
        <div className={`manageAppointment-box-in-left-core-bot-cards-card-container-availability-bg ${status.toLowerCase()}`}>
          <p>{status}</p>
        </div>
      </div>
      <div className="manageAppointment-box-in-left-core-bot-cards-card-container-actions">
        {isEditing ? (
          <>
            <div className="action-decline" onClick={handleDecline}>
              <Close_MD style={{ width: '1.2rem', height: '1.2rem', color: '#00a3af' }} />
            </div>
            <div className="action-approve" onClick={handleApprove}>
              <Check style={{ width: '1.2rem', height: '1.2rem', color: 'white' }} />
            </div>
          </>
        ) : (
          <div className="action-edit" onClick={handleEdit}>
            <Edit_Pencil_Line_01 style={{ width: '1.2rem', height: '1.2rem', color: '#00a3af' }} />
          </div>
        )}
      </div>
    </div>
  );
};

const CertificateList = () => {
  const [certificates, setCertificates] = useState([
    { id: 1, name: "FileName1.pdf", position: "Training", date: "JUL 12 - 2025", status: "Approved" },
    { id: 2, name: "FileName2.pdf", position: "Training", date: "JUL 12 - 2025", status: "Pending" },
    { id: 3, name: "FileName4.pdf", position: "Training", date: "JUL 12 - 2025", status: "Cancelled" },
  ]);
  const [filter, setFilter] = useState('All');

  const handleDelete = (id) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
  };

  const handleConfirm = (name) => {
    alert(`Confirm certificate: ${name}`);
  };

  const handleApprove = (name) => {
    setCertificates(certificates.map(cert =>
      cert.name === name ? { ...cert, status: 'Approved' } : cert
    ));
    alert(`Approved ${name}`);
  };

  const handleDecline = (name) => {
    setCertificates(certificates.map(cert =>
      cert.name === name ? { ...cert, status: 'Declined' } : cert
    ));
    alert(`Declined ${name}`);
  };

  const handleClose = () => {
    alert('Modal closed');
  };

  const filteredCertificates = certificates.filter(cert => {
    if (filter === 'All') return true;
    return cert.status === filter;
  });

  return (
    <div className="appointmentModal">
      <div className="appointmentModal-box">
        <div className="appointmentModal-box-in">
          <div className="appointmentModal-box-in-left">
            <div className="appointmentModal-box-in-left-header">
              <div className="appointmentModal-box-in-left-header-heading">
                <Notebook style={{ color: "var(--black-color-opacity-45)", width: "32px", height: "32px", '--stroke-width': '4px' }} />
                <p>Certificate List</p>
              </div>
              <button
                className="appointmentModal-box-in-left-header-button"
                onClick={handleClose}
              >
                <Close_MD style={{ color: "var(--primary-color)", width: "20px", height: "20px", '--stroke-width': '4px' }} />
              </button>
            </div>
            <div className="appointmentModal-box-in-left-core">
              <div className="appointmentModal-box-in-left-core-top">
                <div className="appointmentModal-box-in-left-core-top-tabs">
                  <button
                    className={`appointmentModal-box-in-left-core-top-tabs-all ${filter === 'All' ? 'active' : ''}`}
                    onClick={() => setFilter('All')}
                  >
                    All
                  </button>
                  <button
                    className={`appointmentModal-box-in-left-core-top-tabs-approved ${filter === 'Approved' ? 'active' : ''}`}
                    onClick={() => setFilter('Approved')}
                  >
                    Approved
                  </button>
                  <button
                    className={`appointmentModal-box-in-left-core-top-tabs-pending ${filter === 'Pending' ? 'active' : ''}`}
                    onClick={() => setFilter('Pending')}
                  >
                    Pending
                  </button>
                  <button
                    className={`appointmentModal-box-in-left-core-top-tabs-cancelled ${filter === 'Cancelled' ? 'active' : ''}`}
                    onClick={() => setFilter('Cancelled')}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
              <div className="appointmentModal-box-in-left-core-bot">
                <div className="appointmentModal-box-in-left-core-bot-cards">
                  {filteredCertificates.map((cert) => (
                    <CertificateCard
                      key={cert.id}
                      name={cert.name}
                      date={cert.date}
                      status={cert.status}
                      onDelete={() => handleDelete(cert.id)}
                      onConfirm={() => handleConfirm(cert.name)}
                      onApprove={handleApprove}
                      onDecline={handleDecline}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateList;