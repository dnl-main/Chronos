import React from 'react';
import './availabilityCard.css';
import Calendar_Add from '../../../assets/icons/Calendar_Add.svg?react';
import Caret_Circle_Down from '../../../assets/icons/Caret_Circle_Down.svg?react';
import Phone from '../../../assets/icons/Phone.svg?react';
import Mail from '../../../assets/icons/Mail.svg?react';
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';

const AvailabilityCard = ({ data, onOpenAppointment }) => {
  const fullName = data
    ? `${data.first_name}${data.middle_name ? ` ${data.middle_name.charAt(0)}.` : ''} ${data.last_name}`
    : 'Loading...';

  const availabilityMap = {
    available: {
      text: 'Available',
      color: 'var(--green-indicator)',
      bgColor: 'var(--green-indicator-opacity-15)',
      indicatorColor: 'var(--green-indicator-opacity-60)',
    },
    vacation: {
      text: 'Vacation',
      color: 'var(--yellow-indicator)',
      bgColor: 'var(--yellow-indicator-opacity-15)',
      indicatorColor: 'var(--yellow-indicator-opacity-60)',
    },
    'on-board': {
      text: 'On Board',
      color: 'var(--red-indicator)',
      bgColor: 'var(--red-indicator-opacity-15)',
      indicatorColor: 'var(--red-indicator-opacity-60)',
    },
  };

  const normalizeAvailability = (value) => value?.toLowerCase().replace(/\s+/g, '-');

  const availabilityKey = normalizeAvailability(data.availability);

  const availability = availabilityMap[availabilityKey] || {
    text: data.availability || 'Unknown',
    color: 'var(--yellow-indicator)',
    bgColor: 'var(--yellow-indicator-opacity-15)',
  };

  const certificate = data.completionStatus || 'Incomplete';
  const certificateColor = data.completionColor || 'var(--red-indicator)';

  return (
    <main className="availability-box-in-cards-card">
      <div
        className="availability-box-in-cards-card-indicator"
        style={{ backgroundColor: certificateColor === 'var(--green-indicator)' ? 'rgba(152, 251, 152, 0.6)' : 'var(--red-indicator-opacity-60)' }}
      ></div>

      <div className="availability-box-in-cards-card-profile">
        <Circle_Primary className="availability-box-in-cards-card-profile-svg" />
        <div className="availability-box-in-cards-card-profile-info">
          <p className="availability-box-in-cards-card-profile-info-text">{fullName}</p>
          <div className="availability-box-in-cards-card-profile-info-job">
            <Circle_Primary style={{ color: 'var(--primary-color)', width: '32px', height: '32px' }} />
            <p>{data.position || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="availability-box-in-cards-card-contact">
        <div className="availability-box-in-cards-card-contact-mobile">
          <Phone className="availability-box-in-cards-card-contact-mobile-svg" />
          <p>{data.mobile ? `(+63) ${data.mobile}` : 'Loading...'}</p>
        </div>
        <div className="availability-box-in-cards-card-contact-email">
          <Mail className="availability-box-in-cards-card-contact-email-svg" />
          <p>{data.email || 'Loading...'}</p>
        </div>
      </div>

      <div className="availability-box-in-cards-card-availability">
        <div
          className="availability-box-in-cards-card-availability-bg"
          style={{ backgroundColor: availability.bgColor || 'transparent' }}
        >
          <Circle_Primary style={{ color: availability.color, width: '28px', height: '28px' }} />
          <p>{availability.text}</p>
        </div>
      </div>

      <div className="availability-box-in-cards-card-certificate">
        <button>
          <p style={{ color: certificateColor }}>{certificate}</p>
          <Caret_Circle_Down
            className="availability-box-in-cards-card-certificate-svg"
            style={{ strokeWidth: '40px', color: certificateColor }}
          />
        </button>
      </div>

      <div className="availability-box-in-cards-card-button">
        <button onClick={() => onOpenAppointment(data.id)}>
          <Calendar_Add className="availability-box-in-cards-card-button-svg" />
        </button>
      </div>
    </main>
  );
};

export default AvailabilityCard;