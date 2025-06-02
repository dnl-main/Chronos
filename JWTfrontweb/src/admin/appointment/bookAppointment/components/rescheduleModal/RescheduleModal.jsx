import React, { useState } from 'react';
import './rescheduleModal.css';
import AppointmentCardMain from '../cards/main/AppointmentCardMain';
import Circle_Primary from '../../../../../assets/icons/Circle_Primary.svg?react';
import Approval from '../../../../../assets/icons/Approval.svg?react';

const RescheduleModal = ({ date, startTime, endTime, user, status, onClose, onConfirmReschedule }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRescheduleNow = () => {
    // const confirmed = window.confirm('Are you sure you want to reschedule?');
    // if (!confirmed) return;
    setShowConfirmation(true);

    // if (onConfirmReschedule) {
    //   onConfirmReschedule();
    // }
  };

  const handleCloseConfirmation = () => {
    // console.log('Closing confirmation'); // Debug
    onConfirmReschedule();
    setShowConfirmation(false);
    //window.location.reload();
    onClose();
  };

  if (showConfirmation) {
    return (
      <div className="confirmationModal">
        <div className="confirmationModal-box">
          <div className="confirmationModal-box-in">
            <p>Reschedule Complete</p>
            <Approval />
            <button onClick={handleCloseConfirmation} className="confirmationModal-button">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bookModal">
      <div className="bookModal-box">
        <div className="bookModal-box-in">
          <header className="bookModal-box-in-header">
            <p className="bookModal-box-in-header-medium">Reschedule Summary</p>
          </header>

          <main className="bookModal-box-in-date">
            <p className="bookModal-box-in-date-regular">New date and time</p>
            <div className="bookModal-box-in-date-cards">
              <div className="bookModal-box-in-date-cards-day">
                <Circle_Primary style={{ color: 'var(--blue-indicator)', width: '20px', height: '20px' }} />
                <div className="bookModal-box-in-date-cards-day-text">
                  <p className="bookModal-box-in-date-cards-day-text-light">Appointment date</p>
                  <p className="bookModal-box-in-date-cards-day-text-semibold">{date || 'N/A'}</p>
                </div>
              </div>

              <div className="bookModal-box-in-date-cards-time">
                <section className="bookModal-box-in-date-cards-time-start">
                  <Circle_Primary style={{ color: 'var(--blue-indicator)', width: '20px', height: '20px' }} />
                  <div className="bookModal-box-in-date-cards-time-start-text">
                    <p className="bookModal-box-in-date-cards-time-start-text-light">Starts at</p>
                    <p className="bookModal-box-in-date-cards-time-start-text-semibold">{startTime || 'N/A'}</p>
                  </div>
                </section>

                <section className="bookModal-box-in-date-cards-time-start">
                  <Circle_Primary style={{ color: 'var(--blue-indicator)', width: '20px', height: '20px' }} />
                  <div className="bookModal-box-in-date-cards-time-start-text">
                    <p className="bookModal-box-in-date-cards-time-start-text-light">Ends at</p>
                    <p className="bookModal-box-in-date-cards-time-start-text-semibold">{endTime || 'N/A'}</p>
                  </div>
                </section>
              </div>
            </div>
          </main>

          <section className="bookModal-box-in-cards">
            <AppointmentCardMain status={status} date={date} user={user || {}} />
          </section>

          <div className="bookModal-box-in-buttons">
            <button onClick={onClose} className="bookModal-box-in-buttons-cancel">
              Cancel
            </button>
            <button onClick={handleRescheduleNow} className="bookModal-box-in-buttons-book">
              Reschedule now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;