import React from 'react';
import './availabilityCard.css';

import Calendar_Add from '../../../assets/icons/Calendar_Add.svg?react';
import Caret_Circle_Down from '../../../assets/icons/Caret_Circle_Down.svg?react';
import Phone from '../../../assets/icons/Phone.svg?react';
import Mail from '../../../assets/icons/Mail.svg?react';
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';

const AvailabilityCard = ({ data }) => {
  // Combine first_name, middle_name, and last_name like ScheduleCard
  const fullName = data
    ? `${data.first_name} ${data.middle_name?.charAt(0)}. ${data.last_name}`
    : 'Loading...';

  // Map availability to display text and color
  const availabilityMap = {
    available: { text: 'Available', color: 'var(--green-indicator)' },
    complete: { text: 'Complete', color: 'var(--blue-indicator)' },
    incomplete: { text: 'Incomplete', color: 'var(--red-indicator)' },
    new: { text: 'New', color: 'var(--yellow-indicator)' },
    'on vacation': { text: 'On Vacation', color: 'var(--yellow-indicator)' },
  };

  const availability = availabilityMap[data.availability?.toLowerCase()] || {
    text: data.availability || 'Unknown',
    color: 'var(--yellow-indicator)',
  };

  // Hardcode certificate
  const certificate = 'Incomplete';

  return (
    <main className="availability-box-in-cards-card">
      <div className="availability-box-in-cards-card-indicator"></div>

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
        <div className="availability-box-in-cards-card-availability-bg">
          <Circle_Primary style={{ color: availability.color, width: '28px', height: '28px' }} />
          <p>{availability.text}</p>
        </div>
      </div>

      <div className="availability-box-in-cards-card-certificate">
        <button>
          <p>{certificate}</p>
          <Caret_Circle_Down
            className="availability-box-in-cards-card-certificate-svg"
            style={{ strokeWidth: '40px' }}
          />
        </button>
      </div>

      <div className="availability-box-in-cards-card-button">
        <button>
          <Calendar_Add className="availability-box-in-cards-card-button-svg" />
        </button>
      </div>
    </main>
  );
};

export default AvailabilityCard;