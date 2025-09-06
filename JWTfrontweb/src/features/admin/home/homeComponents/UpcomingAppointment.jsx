
import React from 'react';
import Book from '../../../../assets/icons/Book.svg?react';
import Arrow_Right_SM from '../../../../assets/icons/Arrow_Right_SM.svg?react';

const UpcomingAppointment = ({ upcomingCount, nearestAppointment, onRedirect }) => {
  return (
    <main className="home-top-main-mid-down">
      <div className="home-top-main-mid-down-header">
        <div className="home-top-main-mid-down-header-main">
          <header>Upcoming appointment</header>
          <Book
            style={{
              color: 'var(--black-color)',
              width: '20px',
              height: '20px',
              '--stroke-width': '4',
            }}
          />
        </div>
        <button className="home-top-main-left-down-header-btn" onClick={onRedirect}>
          <Arrow_Right_SM
            style={{ color: 'var(--black-color)', width: '24px', height: '24px', '--stroke-width': '5' }}
          />
        </button>
      </div>
      <div className="home-top-main-mid-down-data">
        <p>{upcomingCount}</p>
      </div>
      <div className="home-top-main-mid-down-time">
        <p className="home-top-main-mid-down-time-sub">Arrival date</p>
        <p className="home-top-main-mid-down-time-main">
          {nearestAppointment
            ? new Date(nearestAppointment.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : 'N/A'}
        </p>
      </div>
    </main>
  );
};

export default UpcomingAppointment;