import React from 'react';
import './cancelSummary.css';

const CancelSummary = ({ onClose, onConfirm, appointment, user }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
      .toUpperCase()
      .replace(',', '');
  };

  const getFullName = () => {
    if (!user) return 'Unknown User';
    const middleInitial = user.middle_name ? `${user.middle_name.charAt(0)}.` : '';
    return `${user.first_name || ''} ${middleInitial} ${user.last_name || ''}`.trim();
  };

  return (
    <div className="cancel-modal-overlay">
      <div className="cancel-modal-content">
        <div className="cancel-modal-header">
          <h2>Cancelation Summary</h2>
          <span className="cancel-badge">Cancelation</span>
        </div>

        <div className="cancel-modal-card">
          <div className="cancel-modal-user">
            <div className="cancel-avatar" />
            <div className="cancel-user-details">
              <p className="cancel-user-name">{getFullName()}</p>
              <div className="cancel-role-badge">{user?.position || 'Unknown Role'}</div>
            </div>
            <div className="cancel-status">
              <span className="status-dot" />
              <span className="status-text">Booked</span>
              <p className="visit-date-label">Scheduled Visit:</p>
              <p className="visit-date-value">{formatDate(appointment?.date)}</p>
            </div>
          </div>
        </div>

        <div className="cancel-modal-actions">
          <button className="cancel-back-btn" onClick={onClose}>
            Go Back
          </button>
          <button
  className="cancel-confirm-btn"
  onClick={() => {
    const confirmed = window.confirm('Are you sure you want to cancel this appointment?');
    if (confirmed) {
      onConfirm();
    }
  }}
>
  Cancel Now
</button>

        </div>
      </div>
    </div>
  );
};

export default CancelSummary;