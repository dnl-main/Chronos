import React, { useState } from 'react';
import './manageAppointmentCard.css';

import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';

const ManageAppointmentCard = ({ appointment, user, onSelect }) => {
  const [checked, setChecked] = useState(false);

  if (!user || !appointment) {
    return <p>Loading...</p>;
  }

  return (
    <main
      className="manageAppointment-box-in-left-core-bot-cards-card"
      onClick={() => onSelect && onSelect()} // Allow selection when clicked
      style={{ cursor: 'pointer' }}
    >
      <div className="manageAppointment-box-in-left-core-bot-cards-card-check">
        <div
          className={`manageAppointment-box-in-left-core-bot-cards-card-check-box ${checked ? 'checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click from triggering selection
            setChecked(!checked);
          }}
        ></div>
      </div>

      <div className="manageAppointment-box-in-left-core-bot-cards-card-container">
        <div className="manageAppointment-box-in-left-core-bot-cards-card-container-indicator"></div>

        <div className="manageAppointment-box-in-left-core-bot-cards-card-container-profile">
          <Circle_Primary style={{ color: "var(--primary-color)", width: "4rem", height: "4rem" }} />
          <div className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info">
            <p className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info-text">
              {`${user.first_name || ''} ${user.middle_name ? user.middle_name.charAt(0) + '.' : ''} ${user.last_name || ''}`}
            </p>

            <div className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info-job">
              <Circle_Primary style={{ color: "var(--primary-color)", width: "1.4rem", height: "1.4rem" }} />
              <p>{user.position || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="manageAppointment-box-in-left-core-bot-cards-card-container-availability">
          <div className="manageAppointment-box-in-left-core-bot-cards-card-container-availability-bg">
            <Circle_Primary style={{ color: "var(--green-indicator)", width: "1.4rem", height: "1.4rem" }} />
            <p>{user.availability || "Loading..."}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ManageAppointmentCard;
