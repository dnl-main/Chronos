
import React from 'react';
import Calendar_Event from '../../../../assets/icons/Calendar_Event.svg?react';
import Arrow_Right_SM from '../../../../assets/icons/Arrow_Right_SM.svg?react';

const ComingToday = ({ todayCount, todayAppointments, onRedirect }) => {
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
        <p className="home-top-main-mid-up-time-main">
          {todayAppointments.length > 0
            ? new Date(`1970-01-01T${todayAppointments[0].start_time}`).toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })
            : 'N/A'}
        </p>
      </div>
    </main>
  );
};

export default ComingToday;