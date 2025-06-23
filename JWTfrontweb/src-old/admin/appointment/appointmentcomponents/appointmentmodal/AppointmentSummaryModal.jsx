import React from 'react';
import './appointmentSummaryModal.css';

const AppointmentSummaryModal = ({ appointment, user, onClose, onConfirm }) => {
  if (!appointment || !user) return null;

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
    const middleInitial = user.middle_name ? `${user.middle_name.charAt(0)}.` : '';
    return `${user.first_name || ''} ${middleInitial} ${user.last_name || ''}`.trim();
  };

  return (
    <div className="appointmentsummary-modal-overlay">
      <div className="appointmentsummary-modal-content">
        <h2>Appointment Summary</h2>
        <p>
          <strong>Appointment date:</strong> {formatDate(appointment.date)}
        </p>
        <p>
          <strong>Starts at:</strong> {appointment.start_time}
        </p>
        <p>
          <strong>Ends at:</strong> {appointment.end_time}
        </p>

        <div className="appointmentsummary-user-info">
          <p>
            <strong>{getFullName()}</strong>
          </p>
          <p>{user.position || 'N/A'}</p>
          <p>
            <strong>Status:</strong> Rescheduling
          </p>
          <p>
            <strong>Scheduled Visit:</strong>{' '}
            {formatDate(appointment.original_date || appointment.date)}
          </p>
        </div>

        <div className="appointmentsummary-modal-buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Reschedule Now</button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSummaryModal;