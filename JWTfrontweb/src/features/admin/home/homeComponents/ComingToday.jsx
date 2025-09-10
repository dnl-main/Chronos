import React from 'react';
import Calendar_Event from '../../../../assets/icons/Calendar_Event.svg?react';
import Arrow_Right_SM from '../../../../assets/icons/Arrow_Right_SM.svg?react';

const ComingToday = ({ todayCount, todayAppointments, onRedirect }) => {
  // Get the current time
  const now = new Date();
  const todayDate = now.toISOString().split('T')[0]; // e.g., "2025-09-10"

  // Find the appointment with the closest start_time to now
  const closestAppointment = todayAppointments.length > 0
    ? todayAppointments.reduce((closest, appointment) => {
        // Combine today's date with appointment start_time
        const appointmentTime = new Date(`${todayDate}T${appointment.start_time}`);
        const closestTime = closest ? new Date(`${todayDate}T${closest.start_time}`) : null;

        // Calculate time difference in milliseconds
        const currentDiff = Math.abs(now - appointmentTime);
        const closestDiff = closestTime ? Math.abs(now - closestTime) : Infinity;

        return currentDiff < closestDiff ? appointment : closest;
      }, null)
    : null;

  // Format the closest appointment time
  const formattedTime = closestAppointment
    ? new Date(`${todayDate}T${closestAppointment.start_time}`).toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
    : 'N/A';

  return (
    <main className="home-top-main-mid-up">
      <div className="home-top-main-mid-up-header">
        <div className="home-top-main-mid-up-header-main">
          <header>Coming today</header>
          <Calendar_Event
            style={{ color: 'var(--black-color)', width: '20px', height: '20px', '--stroke-width': '6px' }}
          />
        </div>
        <button onClick={onRedirect}>
          <Arrow_Right_SM
            style={{ color: 'var(--black-color)', width: '24px', height: '24px', '--stroke-width': '5' }}
          />
        </button>
      </div>
      <div className="home-top-main-mid-up-data">
        <p>{todayCount}</p>
      </div>
      <div className="home-top-main-mid-up-time">
        <p className="home-top-main-mid-up-time-sub">Arrival time</p>
        <p className="home-top-main-mid-up-time-main">{formattedTime}</p>
      </div>
    </main>
  );
};

export default ComingToday;