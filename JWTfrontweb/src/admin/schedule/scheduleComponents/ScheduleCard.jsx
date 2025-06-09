import React from 'react';
import axios from 'axios';
import './scheduleCard.css';
import Edit_Pencil_01 from '../../../assets/icons/Edit_Pencil_01.svg?react';
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import Check from '../../../assets/icons/Check.svg?react'; // Assuming a check icon for the book button

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const ScheduleCard = ({ appointment, user, allAppointments = [], onEditClick }) => {
  if (!appointment || !user) {
    return <p>Loading...</p>;
  }

  const isUpcoming = (dateString) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    return appointmentDate > today;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const isUpcomingAppointment = isUpcoming(dateString);
    return {
      day: isUpcomingAppointment
        ? date.toLocaleString('en-US', { month: 'short' })
        : date.toLocaleString('en-US', { weekday: 'short' }),
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

  const handleBookAppointment = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      await axios.put(
        `${apiUrl}/appointment/${appointment.id}/book-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
          withCredentials: true,
        }
      );

      // Optionally, trigger a refresh or update the UI
      window.location.reload(); // Simple refresh; consider state management for better UX
    } catch (error) {
      
      alert(error.response?.data?.message || 'Failed to book appointment.');
    }
  };

  const { day, date } = formatDate(appointment.date);
  const startTime = formatTime(appointment.start_time);
  const endTime = formatTime(appointment.end_time);

  const indicatorClass = appointment.status === 'pending' 
    ? 'schedule-today-cards-card-indicator schedule-today-cards-card-indicator-pending'
    : 'schedule-today-cards-card-indicator';

  return (
    <main className="schedule-today-cards-card">
      <section className={indicatorClass}></section>

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
          <p>Assigned to: {appointment.employee || 'N/A'}</p>
        </div>
      </section>

      <section className="schedule-today-cards-card-button">
        {appointment.status === 'pending' && (
          <button
            onClick={handleBookAppointment}
            style={{ marginRight: '10px' }}
          >
            <Check
              style={{
                color: "var(--white-color)",
                width: "32px",
                height: "32px",
                "--stroke-width": "2px",
              }}
            />
          </button>
        )}
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