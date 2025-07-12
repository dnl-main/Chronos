// Dependencies imports
import React from 'react';
import Spinner from '../../../../../components/ui/Spinner';
import Book from '../../../../../assets/icons/Book.svg?react';
import Users from '../../../../../assets/icons/Users.svg?react';
import Clock from '../../../../../assets/icons/Clock.svg?react';

// CSS Imports
import '../../homeUser.css';

// Logic hook import
import useHomeUserLogic from '../../useHomeUserLogic';

const HomeUserLeft = ({
  appointment,
  appointmentLoading,
  capitalize,
  formatTime,
  setIsModalOpen,
  setIsRescheduleModalOpen,
  handleDeleteAppointment,
}) => {



  const renderStatusMessage = () => {
    if (!appointment.date) return 'No appointment scheduled';
    const status = appointment.status.toLowerCase();
    if (status === 'booked') return 'You have an appointment';
    if (status === 'pending') return 'You have a pending appointment please wait for the approval email';
    return 'No appointment scheduled';
  };

  return (
    <div className="homeUser-top-core-left">
      <div className="homeUser-top-core-left-header">
        <header>Scheduled appointment</header>
        <Users style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
      </div>

      {appointmentLoading ? (
        <div className="homeUser-top-core-left-loading" style={{ padding: '1rem', textAlign: 'center' }}>
          <Spinner />
        </div>
      ) : (
        <>
          <div className="homeUser-top-core-left-heading">
            <p style={{ color: appointment.date ? '#000' : '#888' }}>{renderStatusMessage()}</p>
          </div>

          <div className="homeUser-top-core-left-date">
            <div className="homeUser-top-core-left-date-cal">
              <p className="homeUser-top-core-left-date-cal-regular">
                {appointment.date ? new Date(appointment.date).toLocaleString('en-US', { month: 'short' }).toUpperCase() : '---'}
              </p>
              <p className="homeUser-top-core-left-date-cal-semibold">
                {appointment.date ? new Date(appointment.date).getDate() : '--'}
              </p>
            </div>

            <div className="homeUser-top-core-left-date-data">
              {appointment.date ? (
                <>
                  <div className="homeUser-top-core-left-date-data-text">
                    <p className="homeUser-top-core-left-date-data-text-regular">{appointment.date}</p>
                    <p className="homeUser-top-core-left-date-data-text-light">
                      {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long' })}
                    </p>
                    <p className="homeUser-top-core-left-date-data-text-light">
                      Department: {appointment.department ? capitalize(appointment.department) : 'N/A'}
                    </p>

                    {appointment.department === 'crewing' && (
                      <>
                        <p className="homeUser-top-core-left-date-data-text-light">
                          Crewing Dept: {appointment.crewing_dept ? capitalize(appointment.crewing_dept) : 'N/A'}
                        </p>
                        <p className="homeUser-top-core-left-date-data-text-light">
                          Operator: {appointment.operator || 'N/A'}
                        </p>
                      </>
                    )}

                    {appointment.department === 'accounting' && (
                      <p className="homeUser-top-core-left-date-data-text-light">
                        Accounting Task: {appointment.accounting_task ? capitalize(appointment.accounting_task) : 'N/A'}
                      </p>
                    )}

                    <p className="homeUser-top-core-left-date-data-text-light">
                      Assigned to: {appointment.employee || 'N/A'}
                    </p>
                    <p className="homeUser-top-core-left-date-data-text-light">
                      Purpose: {appointment.purpose ? capitalize(appointment.purpose) : 'N/A'}
                    </p>
                  </div>

                  <div className="homeUser-top-core-left-date-data-cards">
                    {['start_time', 'end_time'].map((timeType) => (
                      <div
                        key={timeType}
                        className={`homeUser-top-core-left-date-data-cards-${timeType === 'start_time' ? 'start' : 'end'}`}
                      >
                        <Clock
                          style={{
                            width: '24px',
                            height: '24px',
                            '--stroke-color': 'var(--black-color-opacity-30)',
                            '--stroke-width': '5px',
                          }}
                        />
                        <div className={`homeUser-top-core-left-date-data-cards-${timeType === 'start_time' ? 'start' : 'end'}-text`}>
                          <p className={`homeUser-top-core-left-date-data-cards-${timeType === 'start_time' ? 'start' : 'end'}-text-light`}>
                            {timeType === 'start_time' ? 'Starts at' : 'Ends at'}
                          </p>
                          <p className={`homeUser-top-core-left-date-data-cards-${timeType === 'start_time' ? 'start' : 'end'}-text-medium`}>
                            {formatTime(appointment[timeType])}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="homeUser-top-core-left-date-data-buttons">
                    <button onClick={() => setIsRescheduleModalOpen(true)} className="button-resched">
                      Reschedule Appointment
                    </button>
                    <button onClick={handleDeleteAppointment} className="red-button-cancel">
                      Delete Appointment
                    </button>
                  </div>
                </>
              ) : (
                <p style={{ padding: '1rem', fontStyle: 'italic' }}>
                  You have no scheduled appointment yet.
                </p>
              )}
            </div>
          </div>

          {!appointment.date && (
            <div className="homeUser-top-core-left-btn">
              <button onClick={() => setIsModalOpen(true)} className="homeUser-top-core-left-btn-button">
                <Book style={{ color: 'var(--white-color)', width: '20px', height: '20px' }} />
                Set Appointment
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomeUserLeft;
