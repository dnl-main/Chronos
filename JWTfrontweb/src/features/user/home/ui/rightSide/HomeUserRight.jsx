import React from 'react';
import './homeUserRight.css';
import './homeUserRightMQ.css';

import useRightLogic from './useRightLogic'; 

import Spinner from '../../../../../components/ui/Spinner';
import Cloud_Upload from '../../../../../assets/icons/Cloud_Upload.svg?react';
import File_Add from '../../../../../assets/icons/File_Add.svg?react';
import Folder_Open from '../../../../../assets/icons/Folder_Open.svg?react';
import Check from '../../../../../assets/icons/Check.svg?react';
import Circle_Primary from '../../../../../assets/icons/Circle_Primary.svg?react';
import Bell from '../../../../../assets/icons/Bell.svg?react';




const BookingCard = ({ name, dept, start_time, end_time, date, status }) => {
  const isBooked = status?.toLowerCase() === 'booked';
  const isPending = status?.toLowerCase() === 'pending';
  const isCancelled = status?.toLowerCase() === 'cancelled';
  const isCompleted = status?.toLowerCase() === 'completed';

  const { formatTime } = useRightLogic();
  const formattedTime = `${formatTime(start_time)} - ${formatTime(end_time)}`;

  return (
    <main className="homeUser-top-core-right-cards-card">
      <div className="homeUser-top-core-right-cards-card-up">
        <div className="homeUser-top-core-right-cards-card-up-admin">
          <Circle_Primary
            style={{
              color: 'var(--black-color-opacity-60)',
              width: '28px',
              height: '28px',
            }}
          />
          <div className="homeUser-top-core-right-cards-card-up-admin-text">
            <p className="homeUser-top-core-right-cards-card-up-admin-text-name">{name}</p>
            <p className="homeUser-top-core-right-cards-card-up-admin-text-dept">{dept}</p>
          </div>        

        </div>

        <div
            className={`homeUser-top-core-right-cards-card-up-status-bg ${
              isBooked ? 'booked' : isPending ? 'pending' : isCancelled ? 'cancelled' : isCompleted ? 'completed' : 'default'
            }`}
          >
            <Circle_Primary
              className="homeUser-top-core-right-cards-card-up-status-icon"
            />
            <p>{status ? status : 'N/A'}</p>
        </div>
        
      </div>
      <div className="homeUser-top-core-right-cards-card-down">
        <button className="homeUser-top-core-right-cards-card-down-btn">
          <p>Edit</p>
          {/* <Bell style={{ color: 'var(--primary-color)', width: '20px', height: '20px', '--stroke-width': '5' }} /> */}
        </button>
        <div className="homeUser-top-core-right-cards-card-down-text">
          <p className="homeUser-top-core-right-cards-card-down-text-time">{formattedTime}</p>
          <p className="homeUser-top-core-right-cards-card-down-text-date">{date}</p>
        </div>
      </div>
    </main>
  );
};

const HomeUserRight = () => {
  // Updated to include formatTime and capitalize from useRightLogic
  const { appointments, loading, error, formatTime, capitalize } = useRightLogic();

  return (
    <div className="homeUser-top-core-right">
      <div className="homeUser-top-core-right-header">
        <p>Booking History</p>
      </div>
      <div className="homeUser-top-core-right-cards">
        {loading ? (
          <Spinner />
        ) : error ? (
          <p className="homeUser-error">{error}</p>
        ) : appointments.length === 0 ? (
          <p className="homeUser-empty">No appointments found.</p>
        ) : (
          appointments.map((appointment) => (
            <BookingCard
              // Updated key to use appointment.id if available
              key={appointment.id || appointment.index}
              // Applied capitalize to name and dept for consistent display
              name={capitalize(appointment.employee)}
              dept={capitalize(appointment.department)}
              // Applied formatTime to time for user-friendly display
              // time={formatTime(appointment.start_time)}
              start_time={appointment.start_time} // Pass start_time directly
              end_time={appointment.end_time} // Pass end_time directly
              date={appointment.date} // Kept date as is, can format if needed
              status={capitalize(appointment.status)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomeUserRight;