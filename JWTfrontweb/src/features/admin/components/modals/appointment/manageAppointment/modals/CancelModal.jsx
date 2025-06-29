import React, { useState } from 'react';
import './cancelModal.css'; // Reuse existing styles
import AppointmentCardMain from '../cards/main/AppointmentCardMain';
import Circle_Primary from '../../../../../../../assets/icons/Circle_Primary.svg?react';
import Approval from '../../../../../../../assets/icons/Approval.svg?react';

const CancelConfirmation = ({ onClose }) => {
  return (
    <div className="confirmationModal">
      <div className="confirmationModal-box">
        <div className="confirmationModal-box-in">
          <p>Appointment Cancelled</p>
          <Approval />
<button
  onClick={() => {
    onClose();
    // window.location.reload();
  }}
  className="confirmationModal-button"
>
  Close
</button>

        </div>
      </div>
    </div>
  );
};

const CancelModal = ({ date, startTime, endTime, user, status, onClose, onConfirmCancel }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCancelNow = () => {
    if (onConfirmCancel) {
      onConfirmCancel(); // Updates state outside
    }
    setShowConfirmation(true); // Show confirmation
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    onClose(); // Fully close CancelModal
  };

  return (
    <div className="cancelModal">
      <div className="cancelModal-box">
        <div className="cancelModal-box-in">
          <header className="cancelModal-box-in-header">
            <p className="cancelModal-box-in-header-medium">Cancel Appointment</p>
          </header>

          <main className="cancelModal-box-in-date">
            <p className="cancelModal-box-in-date-regular">Date and time</p>
            <div className="cancelModal-box-in-date-cards">
              <div className="cancelModal-box-in-date-cards-day">
                <Circle_Primary style={{ color: "var(--blue-indicator)", width: "20px", height: "20px" }} />
                <div className="cancelModal-box-in-date-cards-day-text">
                  <p className="cancelModal-box-in-date-cards-day-text-light">Appointment date</p>
                  <p className="cancelModal-box-in-date-cards-day-text-semibold">{date}</p>
                </div>
              </div>

              <div className="cancelModal-box-in-date-cards-time">
                <section className="cancelModal-box-in-date-cards-time-start">
                  <Circle_Primary style={{ color: "var(--blue-indicator)", width: "20px", height: "20px" }} />
                  <div className="cancelModal-box-in-date-cards-time-start-text">
                    <p className="cancelModal-box-in-date-cards-time-start-text-light">Starts at</p>
                    <p className="cancelModal-box-in-date-cards-time-start-text-semibold">{startTime}</p>
                  </div>
                </section>

                <section className="cancelModal-box-in-date-cards-time-start">
                  <Circle_Primary style={{ color: "var(--blue-indicator)", width: "20px", height: "20px" }} />
                  <div className="cancelModal-box-in-date-cards-time-start-text">
                    <p className="cancelModal-box-in-date-cards-time-start-text-light">Ends at</p>
                    <p className="cancelModal-box-in-date-cards-time-start-text-semibold">{endTime}</p>
                  </div>
                </section>
              </div>
            </div>
          </main>

          <section className="cancelModal-box-in-cards">
            <AppointmentCardMain status={status} date={date} user={user} />
          </section>

          <div className="cancelModal-box-in-buttons">
            <button 
              onClick={onClose}
              className="cancelModal-box-in-buttons-cancel"
            >
              Go Back
            </button>
            <button
              onClick={handleCancelNow}
              className="cancelModal-box-in-buttons-book"
            >
              Cancel Now
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Overlay */}
      {showConfirmation && <CancelConfirmation onClose={handleCloseConfirmation} />}
    </div>
  );
};

export default CancelModal;
