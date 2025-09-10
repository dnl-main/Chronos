import React from 'react';
import { format, parseISO } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import Calendar_Event from '../../../../assets/icons/Calendar_Event.svg?react';
import Arrow_Right_SM from '../../../../assets/icons/Arrow_Right_SM.svg?react';

const ComingToday = ({ todayCount, todayAppointments, onRedirect }) => {
  // Get the current date in PST
  const now = new Date();
  const todayDate = format(utcToZonedTime(now, 'America/Los_Angeles'), 'yyyy-MM-dd'); // e.g., "2025-09-11" in PST
  console.log('Today Date (PST):', todayDate); // Debug log
  console.log('Today Appointments:', todayAppointments); // Debug log

  // Find the appointment with the closest start_time to now
  const closestAppointment = todayAppointments.length > 0
    ? todayAppointments.reduce((closest, appointment) => {
        try {
          // Combine today's date (PST) with appointment start_time
          const appointmentTime = parseISO(`${todayDate}T${appointment.start_time}`);
          const appointmentTimeInPST = utcToZonedTime(appointmentTime, 'America/Los_Angeles');
          const appointmentTimeInUTC = zonedTimeToUtc(appointmentTimeInPST, 'America/Los_Angeles');

          const closestTime = closest
            ? zonedTimeToUtc(
                parseISO(`${todayDate}T${closest.start_time}`),
                'America/Los_Angeles'
              )
            : null;

          // Calculate time difference in milliseconds
          const currentDiff = Math.abs(now - appointmentTimeInUTC);
          const closestDiff = closestTime ? Math.abs(now - closestTime) : Infinity;

          return currentDiff < closestDiff ? appointment : closest;
        } catch (error) {
          console.error('Error parsing appointment time:', appointment.start_time, error);
          return closest;
        }
      }, null)
    : null;

  console.log('Closest Appointment:', closestAppointment); // Debug log

  // Format the closest appointment time in PHT
  const formattedTime = closestAppointment
    ? format(
        utcToZonedTime(
          parseISO(`${todayDate}T${closestAppointment.start_time}`),
          'Asia/Manila'
        ),
        'h:mm a'
      )
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