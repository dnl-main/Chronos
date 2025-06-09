import React, { useState, useEffect } from 'react';
import './appointmentCardMain.css';

import Circle_Primary from '../../../../../../assets/icons/Circle_Primary.svg?react';

const AppointmentCardMain = ({ status, date, user }) => {
  const isBooked = status === "booked";
  const isPending = status === "pending";

  return (
    <main className="manageAppointment-box-in-left-core-bot-cards-card-container">
      <div className={`manageAppointment-box-in-left-core-bot-cards-card-container-indicator ${
        isBooked ? "booked" : isPending ? "pending" : ""
      }`}>
      </div>

      <div className="manageAppointment-box-in-left-core-bot-cards-card-container-profile">
        <Circle_Primary style={{ color: "var(--primary-color)", width: "4rem", height: "4rem" }} />
        <div className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info">
          <p className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info-text">
            {`${user.first_name || ''} ${user.middle_name ? user.middle_name.charAt(0) + '.' : ''} ${user.last_name || ''}`}
          </p>
          <div className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info-job">
            <Circle_Primary style={{ color: "var(--primary-color)", width: "1.4rem", height: "1.4rem" }} />
            {user.position || 'N/A'}
          </div>
        </div>
      </div>

      <div className="manageAppointment-box-in-left-core-bot-cards-card-container-availability">
        <div
          className={`manageAppointment-box-in-left-core-bot-cards-card-container-availability-bg ${
            isBooked ? "booked" : isPending ? "pending" : "available"
          }`}
        >
          <Circle_Primary
            style={{
              color: isBooked ? "var(--blue-indicator)" : isPending ? "var(--yellow-indicator)" : "var(--green-indicator)",
              width: "1.4rem",
              height: "1.4rem",
            }}
          />
          <p>{isBooked ? "Booked" : isPending ? "Pending" : "Available"}</p>
        </div>

        {(isBooked || isPending) && (
          <div className="manageAppointment-box-in-left-core-bot-cards-card-container-availability-booked">
            <div className="manageAppointment-box-in-left-core-bot-cards-card-container-availability-booked-text">
              <p className="manageAppointment-box-in-left-core-bot-cards-card-container-availability-booked-text-light">
                Scheduled visit
              </p>
              <p className="manageAppointment-box-in-left-core-bot-cards-card-container-availability-booked-text-bold">
                {date}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AppointmentCardMain;