// Dependencies imports
import React from 'react';
import './homeUserLeft.css';
import Spinner from '../../../../../components/ui/Spinner';
import Book from '../../../../../assets/icons/Book.svg?react';
import Users from '../../../../../assets/icons/Users.svg?react';
import Clock from '../../../../../assets/icons/Clock.svg?react';

import BookAppointmentModal from '../../../components/modals/BookAppointment';

// Logic hook import
import useHomeUserLeftLogic from './useHomeUserLeftLogic';

const HomeUserLeft = () => {
  const {
    appointment,
    appointmentLoading,
    capitalize,
    formatTime,
    isModalOpen,
    isRescheduleModalOpen,
    setIsModalOpen,
    setIsRescheduleModalOpen,
    handleDeleteAppointment,
    handleAppointmentBooked,
  } = useHomeUserLeftLogic();

  const renderStatusMessage = () => {
    if (!appointment?.date) return 'No appointment scheduled';
    const status = appointment.status.toLowerCase();
    if (status === 'booked') return 'You have an appointment';
    if (status === 'pending') return 'You have a pending appointment';
    return 'No appointment scheduled';
  };

  const capitalizeFullName = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };


  const renderInstructions = () => {
    const { department, crewing_dept, purpose, employee, operator } = appointment;

    if (!department || !employee) return null;

    // const capitalizedDepartment = capitalize(department);
    const capitalizedDepartment = department ? capitalize(department) : '';

    // const capitalizedOperator = capitalize(operator);
    const capitalizedOperator = operator ? capitalize(operator) : '';

    // const capitalizedPurpose = purpose ? capitalize(purpose) : 'your appointment';
    const capitalizedPurpose = purpose ? capitalize(purpose) : 'your appointment';


    // Special handling for crewing department with sub-department
    if (department.toLowerCase() === 'crewing' && crewing_dept) {
      // const capitalizedCrewingDept = capitalize(crewing_dept);
      const capitalizedCrewingDept = crewing_dept ? capitalize(crewing_dept) : '';

      return (
        <div className="homeUser-top-core-left-down-description">
          <div className="homeUser-top-core-left-down-description-first"> 
            <p className="homeUser-top-core-left-down-description-regular">Please proceed to the</p>
            <p className="homeUser-top-core-left-down-description-semibold">{capitalizedOperator}</p>
            <p className="homeUser-top-core-left-down-description-regular">of</p>           
          </div>
          <div className="homeUser-top-core-left-down-description-second"> 
            <p className="homeUser-top-core-left-down-description-semibold">{capitalizedCrewingDept}</p>
            <p className="homeUser-top-core-left-down-description-regular">for {capitalizedPurpose}</p>           
          </div>
          
         
        </div>
      );
    }

    // Default instruction for all other departments
    return (
      <div className="homeUser-top-core-left-down-description">
        <div className="homeUser-top-core-left-down-description-first"> 
          <p className="homeUser-top-core-left-down-description-regular">Please proceed to the</p>
          <p className="homeUser-top-core-left-down-description-semibold">{capitalizedOperator}</p>
          <p className="homeUser-top-core-left-down-description-regular">of </p>
        </div>

        <div className="homeUser-top-core-left-down-description-second"> 
          <p className="homeUser-top-core-left-down-description-semibold">{capitalizedDepartment} Department</p>
          <p className="homeUser-top-core-left-down-description-regular">for {capitalizedPurpose}</p>
        </div>

        
        
      </div>
    );
  };



  const renderWithAppointment = () => (
    <>
      <div className="homeUser-top-core-left-up">
        <div className="homeUser-top-core-left-up-header">
          <header>Scheduled appointment</header>
          <Users style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
        </div> {/* homeUser-top-core-left-up-header */}

        <div className="homeUser-top-core-left-up-status">
          <p className="homeUser-top-core-left-up-status-bold">{renderStatusMessage()}</p>
          <p className="homeUser-top-core-left-up-status-light">with</p>
          <p className="homeUser-top-core-left-up-status-medium">{capitalizeFullName(appointment.employee)}</p>
        </div> {/* homeUser-top-core-left-up-status */}

        <div className="homeUser-top-core-left-up-date">
          <div className="homeUser-top-core-left-up-date-cal">
            <p className="homeUser-top-core-left-up-date-cal-regular">
              {appointment.date ? new Date(appointment.date).toLocaleString('en-US', { month: 'short' }).toUpperCase() : '---'}
            </p> {/* DEC */}
            <p className="homeUser-top-core-left-up-date-cal-semibold">
              {appointment.date ? new Date(appointment.date).getDate() : '--'}
            </p> {/* 28 */}
          </div> {/* homeUser-top-core-left-up-date-cal */}

          <div className="homeUser-top-core-left-up-date-data">
                    
            <div className="homeUser-top-core-left-up-date-data-text">
              <p className="homeUser-top-core-left-up-date-data-text-regular">
                {appointment.date}
              </p> {/* December 28, 2024 */}
              <p className="homeUser-top-core-left-up-date-data-text-light">
                {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long' })}
              </p> {/* Thursday */}
            </div> {/* homeUser-top-core-left-up-date-data-text */}
            
            <div className="homeUser-top-core-left-up-date-data-cards">
              {/* Start Time Card */}
              <div className="homeUser-top-core-left-up-date-data-cards-start">
                <Clock
                  style={{
                    width: '4vh',
                    height: '4vh',
                    '--stroke-color': 'var(--black-color-opacity-30)',
                    '--stroke-width': '5px',
                  }}
                />
                <div className="homeUser-top-core-left-up-date-data-cards-start-text">
                  <p className="homeUser-top-core-left-up-date-data-cards-start-text-light">
                    Starts at
                  </p>
                  <p className="homeUser-top-core-left-up-date-data-cards-start-text-medium">
                    {formatTime(appointment.start_time)}
                  </p> {/* Start time */}
                </div> {/* homeUser-top-core-left-up-date-data-cards-start-text */}
              </div> {/* homeUser-top-core-left-up-date-data-cards-start */}

              {/* End Time Card */}
              <div className="homeUser-top-core-left-up-date-data-cards-end">
                <Clock
                  style={{
                    width: '4vh',
                    height: '4vh',
                    '--stroke-color': 'var(--black-color-opacity-30)',
                    '--stroke-width': '5px',
                  }}
                />
                <div className="homeUser-top-core-left-up-date-data-cards-end-text">
                  <p className="homeUser-top-core-left-up-date-data-cards-end-text-light">
                    Ends at
                  </p>
                  <p className="homeUser-top-core-left-up-date-data-cards-end-text-medium">
                    {formatTime(appointment.end_time)}
                  </p> {/* End time */}
                </div> {/* homeUser-top-core-left-up-date-data-cards-end-text */}
              </div> {/* homeUser-top-core-left-up-date-data-cards-end */}
            </div> {/* homeUser-top-core-left-up-date-data-cards */}
          </div> {/* homeUser-top-core-left-up-date-data */}
        </div> {/* homeUser-top-core-left-up-date */}
      </div> {/* homeUser-top-core-left-up */}


      <div className="homeUser-top-core-left-down">
        {renderInstructions()}        
        {/* homeUser-top-core-left-down-description */}

        <div className="homeUser-top-core-left-down-buttons">          
          <button onClick={handleDeleteAppointment} className="homeUser-top-core-left-down-cancel">
            Delete Appointment
          </button>
          <button onClick={() => setIsRescheduleModalOpen(true)} className="homeUser-top-core-left-down-buttons-reschedule">
            Reschedule Appointment
          </button>
        </div> {/* homeUser-top-core-left-down-buttons */}
      </div> {/* homeUser-top-core-left-down */}
    </>
  );

  const renderWithoutAppointment = () => (
    <>
      <div className="homeUser-top-core-left-heading">
        <p style={{ color: '#888' }}>{renderStatusMessage()}</p>
      </div>

      <div className="homeUser-top-core-left-date">
        <div className="homeUser-top-core-left-date-cal">
          <p className="homeUser-top-core-left-date-cal-regular">---</p>
          <p className="homeUser-top-core-left-date-cal-semibold">--</p>
        </div>

        <div className="homeUser-top-core-left-date-data">
          <p style={{ padding: '1rem', fontStyle: 'italic' }}>
            You have no scheduled appointment yet.
          </p>
        </div>
      </div>

      <div className="homeUser-top-core-left-btn">
        <button onClick={() => setIsModalOpen(true)} className="homeUser-top-core-left-btn-button">
          <Book style={{ color: 'var(--white-color)', width: '20px', height: '20px' }} />
          Set Appointment
        </button>
      </div>
    </>
  );

  return (
    <div className="homeUser-top-core-left">
      

      {appointmentLoading ? (
        <div className="homeUser-top-core-left-loading" style={{ padding: '1rem', textAlign: 'center' }}>
          <Spinner className="homeUser-top-core-left-loading" />

        </div>
      ) : appointment.date ? (
        renderWithAppointment()
      ) : (
        renderWithoutAppointment()
      )}

      {isModalOpen && (
        <BookAppointmentModal
          onClose={() => setIsModalOpen(false)}
          onAppointmentBooked={handleAppointmentBooked}
        />
      )}

      {isRescheduleModalOpen && (
        <BookAppointmentModal
          onClose={() => setIsRescheduleModalOpen(false)}
          onAppointmentBooked={handleAppointmentBooked}
          appointment={appointment}
          isReschedule={true}
        />
      )}
    </div>
  );
};

export default HomeUserLeft;
