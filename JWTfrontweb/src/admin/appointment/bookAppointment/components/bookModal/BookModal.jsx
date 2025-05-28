import React, { useState } from 'react';
import './bookModal.css';
import AppointmentCardMain from '../cards/main/AppointmentCardMain';
import Circle_Primary from '../../../../../assets/icons/Circle_Primary.svg?react';
import Approval from '../../../../../assets/icons/Approval.svg?react';


const BookConfirmation = ({ onClose }) => {
  return (
    <div className="confirmationModal">
      <div className="confirmationModal-box">
				<div className="confirmationModal-box-in">
					<p>Booking Complete</p>
					<Approval />
        	<button 
						onClick={onClose} 
						className="confirmationModal-button"
					>	Close
					</button>
				</div>
      </div>
    </div>
  );
};

const BookModal = ({ date, startTime, endTime, user, status, onClose, onConfirmBooking }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleBookNow = () => {
		if (onConfirmBooking) {
			onConfirmBooking();  // Updates appointments but does NOT close modal now
		}
		setShowConfirmation(true);  // Show confirmation inside the modal after booking
	};

	const handleCloseConfirmation = () => {
		setShowConfirmation(false);
		onClose();  // Now close BookModal when user closes confirmation
	};

  return (
    <div className="bookModal">
      <div className="bookModal-box">
        <div className="bookModal-box-in">
          <header className="bookModal-box-in-header">
            <p className="bookModal-box-in-header-medium">Appointment summary</p>
          </header>

          <main className="bookModal-box-in-date">
            <p className="bookModal-box-in-date-regular">Date and time</p>
            <div className="bookModal-box-in-date-cards">
              <div className="bookModal-box-in-date-cards-day">
                <Circle_Primary style={{ color: "var(--blue-indicator)", width: "20px", height: "20px" }} />
                <div className="bookModal-box-in-date-cards-day-text">
                  <p className="bookModal-box-in-date-cards-day-text-light">Appointment date</p>
                  <p className="bookModal-box-in-date-cards-day-text-semibold">{date}</p>
                </div>
              </div>

              <div className="bookModal-box-in-date-cards-time">
                <section className="bookModal-box-in-date-cards-time-start">
                  <Circle_Primary style={{ color: "var(--blue-indicator)", width: "20px", height: "20px" }} />
                  <div className="bookModal-box-in-date-cards-time-start-text">
                    <p className="bookModal-box-in-date-cards-time-start-text-light">Starts at</p>
                    <p className="bookModal-box-in-date-cards-time-start-text-semibold">{startTime}</p>
                  </div>
                </section>

                <section className="bookModal-box-in-date-cards-time-start">
                  <Circle_Primary style={{ color: "var(--blue-indicator)", width: "20px", height: "20px" }} />
                  <div className="bookModal-box-in-date-cards-time-start-text">
                    <p className="bookModal-box-in-date-cards-time-start-text-light">Ends at</p>
                    <p className="bookModal-box-in-date-cards-time-start-text-semibold">{endTime}</p>
                  </div>
                </section>
              </div>
            </div>
          </main>

          <section className="bookModal-box-in-cards">
             <AppointmentCardMain status={status} date={date} user={user} />
          </section>

          <div className="bookModal-box-in-buttons">
            <button 
							onClick={onClose}
							className="bookModal-box-in-buttons-cancel"
						>
							Cancel
						</button>
            <button
							onClick={handleBookNow}   // Use the local handler here
							className="bookModal-box-in-buttons-book"
						>
							Book now
						</button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && <BookConfirmation onClose={handleCloseConfirmation} />}

    </div>
  );
};

export default BookModal;
