import React from 'react';
import './scheduleCard.css';
import Edit_Pencil_01 from '../../../assets/icons/Edit_Pencil_01.svg?react';
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';

const ScheduleCard = ({ appointment, user, allAppointments = [], onEditClick }) => {
  if (!appointment || !user) {
    return <p>Loading...</p>;
  }

  const isUpcoming = (dateString) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    // Consider an appointment upcoming if it's after today
    return appointmentDate > today;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const isUpcomingAppointment = isUpcoming(dateString);
    return {
      day: isUpcomingAppointment
        ? date.toLocaleString('en-US', { month: 'short' }) // e.g., "Jan"
        : date.toLocaleString('en-US', { weekday: 'short' }), // e.g., "Sat"
      date: date.getDate(),
    };
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').slice(0, 2);
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };

  const formatPurpose = (purpose) => {
    if (!purpose) return 'N/A';
    return purpose.charAt(0).toUpperCase() + purpose.slice(1);
  };

  const { day, date } = formatDate(appointment.date);
  const startTime = formatTime(appointment.start_time);
  const endTime = formatTime(appointment.end_time);

  return (
    <main className="schedule-today-cards-card">
      <section className="schedule-today-cards-card-indicator"></section>

      <section className="schedule-today-cards-card-date">
        <p className="schedule-today-cards-card-date-day">{day}</p>
        <p className="schedule-today-cards-card-date-date">{date}</p>
      </section>

      <section className="schedule-today-cards-card-separator">
        <div className="schedule-today-cards-card-separator-line"></div>
      </section>

      <section className="schedule-today-cards-card-time">
        <p className="schedule-today-cards-card-time-start">{startTime}</p>
        <p className="schedule-today-cards-card-time-end">to {endTime}</p>
      </section>

      <section className="schedule-today-cards-card-profile">
        <Circle_Primary className="schedule-today-cards-card-profile-svg" />
        <div className="schedule-today-cards-card-profile-info">
          <p className="schedule-today-cards-card-profile-info-text">
            {`${user.first_name}${user.middle_name ? ` ${user.middle_name.charAt(0)}.` : ''} ${user.last_name}`}
          </p>
          <div className="schedule-today-cards-card-profile-info-job">
            <Circle_Primary style={{ color: "var(--primary-color)", width: "32px", height: "32px" }} />
            <p>{user.position || 'N/A'}</p>
          </div>
        </div>
      </section>

      <section className="schedule-today-cards-card-contact">
        <div className="schedule-today-cards-card-contact-mobile">
          <p>Purpose of visit: {formatPurpose(appointment.purpose)}</p>
        </div>

        <div className="schedule-today-cards-card-contact-email">
          <p>Department: {appointment.department || 'N/A'}</p>
        </div>

        <div className="schedule-today-cards-card-contact-email">
          <p>Employee: {appointment.employee || 'N/A'}</p>
        </div>

        
      </section>

      <section className="schedule-today-cards-card-button">
        <button
          onClick={() =>
            onEditClick({
              appointment,
              user,
              bookedAppointments: allAppointments.filter(
                (a) => a.status === 'booked' && a.id !== appointment.id && a.user
              ),
            })
          }
        >
          <Edit_Pencil_01
            style={{
              color: "var(--white-color)",
              width: "32px",
              height: "32px",
              "--stroke-width": "2px",
            }}
          />
        </button>
      </section>
    </main>
  );
};

export default ScheduleCard;