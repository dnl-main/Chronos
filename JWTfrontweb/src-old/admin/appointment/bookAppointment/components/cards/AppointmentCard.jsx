import React from 'react';
import './appointmentCard.css';

import AppointmentCardMain from './main/AppointmentCardMain';

const AppointmentCard = ({ id, status, date, user, selectedId, setSelectedId }) => {
  const checked = selectedId === id;

  const handleCheck = (e) => {
    e.stopPropagation();
    setSelectedId(checked ? null : id); // toggle selection on/off
  };

  return (
    <main className="manageAppointment-box-in-left-core-bot-cards-card">
      <div className="manageAppointment-box-in-left-core-bot-cards-card-check">
        <div
          className={`manageAppointment-box-in-left-core-bot-cards-card-check-box ${checked ? 'checked' : ''}`}
          onClick={handleCheck}
        />
      </div>
      <AppointmentCardMain status={status} date={date} user={user} />
    </main>
  );
};

export default AppointmentCard;
