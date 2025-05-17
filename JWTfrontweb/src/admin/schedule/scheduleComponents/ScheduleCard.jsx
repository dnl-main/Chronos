import React from 'react';
import './scheduleCard.css';

import Phone from '../../../assets/icons/Phone.svg?react';
import Mail from '../../../assets/icons/Mail.svg?react';
import Edit_Pencil_01 from '../../../assets/icons/Edit_Pencil_01.svg?react';
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';

const ScheduleCard = ({ appointment, user }) => {
  if (!appointment || !user) {
    return <p>Loading...</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleString('en-US', { weekday: 'short' }),
      date: date.getDate(),
    };
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').slice(0, 2);
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };

  const { day, date } = formatDate(appointment.date);
  const startTime = formatTime(appointment.start_time);
  const endTime = formatTime(appointment.end_time);

     let formattedPhone = 'N/A';
  if (user?.mobile) {
    const rawPhone = user.mobile;
    const cleaned = rawPhone.startsWith('0') ? rawPhone.substring(1) : rawPhone;
    formattedPhone = cleaned.length >= 10
      ? `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
      : cleaned;
  }
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
            {`${user.first_name} ${user.middle_name?.charAt(0) || ''}. ${user.last_name}`}
          </p>
          <div className="schedule-today-cards-card-profile-info-job">
            <Circle_Primary style={{ color: "var(--primary-color)", width: "32px", height: "32px" }} />
            <p>{user.position || 'N/A'}</p>
          </div>
        </div>
      </section>

      <section className="schedule-today-cards-card-contact">
        <div className="schedule-today-cards-card-contact-mobile">
          <Phone className="schedule-today-cards-card-contact-mobile-svg" />
          <p>{formattedPhone ? `(+63)${formattedPhone}` : 'Loading...'}</p>
        </div>

        <div className="schedule-today-cards-card-contact-email">
          <Mail className="schedule-today-cards-card-contact-email-svg" />
          <p>{user.email || 'N/A'}</p>
        </div>
      </section>

      <section className="schedule-today-cards-card-button">
        <button>
          <Edit_Pencil_01 style={{ color: "var(--white-color)", width: "32px", height: "32px", "--stroke-width": "2px" }} />
        </button>
      </section>
    </main>
  );
};

export default ScheduleCard;