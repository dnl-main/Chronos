import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './bookNotificationUser.css';

import Calendar_Event from '../../../../assets/icons/Calendar_Event.svg?react';
import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';
import Edit_Pencil_01 from '../../../../assets/icons/Edit_Pencil_01.svg?react';
import Calendar_Week from '../../../../assets/icons/Calendar_Week.svg?react';
import Clock from '../../../../assets/icons/Clock.svg?react';


const BookNotificationUser = () => {     
  return (
    <main className="bookNotificationUser-cards-card">
      <section className="bookNotificationUser-cards-card-indicator">
      </section> {/* bookNotificationUser-cards-card-indicator */}

      <section className="bookNotificationUser-cards-card-info">
        <Circle_Primary style={{ color: "var(--black-color)", width: "72px", height: "72px" }} />
        <div className="bookNotificationUser-cards-card-info-details">
          <div className="bookNotificationUser-cards-card-info-details-main">
            <p className="bookNotificationUser-cards-card-info-details-main-name">John Daniel R. Doe</p>
            <Circle_Primary style={{ color: "var(--black-color-opacity-45)", width: "8px", height: "8px" }} />
            <p className="bookNotificationUser-cards-card-info-details-main-time">4 hours ago  - </p>
            <p className="bookNotificationUser-cards-card-info-details-main-role">Fleet crew manager</p>
          </div> {/* bookNotificationUser-cards-card-info-details-main */}

          <div className="bookNotificationUser-cards-card-info-details-sub">
            <p className="bookNotificationUser-cards-card-info-details-sub-detail">You have an Appointment with</p>
            <p className="bookNotificationUser-cards-card-info-details-sub-name">John Daniel R. Doe</p>
          </div> {/* bookNotificationUser-cards-card-info-details-sub */}

          <div className="bookNotificationUser-cards-card-info-details-box">
            <div className="bookNotificationUser-cards-card-info-details-box-date">

              <Calendar_Week style={{  
                width: "24px", 
                height: "24px", 
                '--stroke-width': '2px',
                '--stroke-color': 'var(--black-color-opacity-30)'
              }} />
              <div className="bookNotificationUser-cards-card-info-details-box-date-day">
                <p className="bookNotificationUser-cards-card-info-details-box-date-day-day">Monday</p>
                <p className="bookNotificationUser-cards-card-info-details-box-date-day-date">DEC-28-2024</p>
              </div> {/* bookNotificationUser-cards-card-info-details-box-date-day */}
            </div> {/* bookNotificationUser-cards-card-info-details-box-date */}

            <div className="bookNotificationUser-cards-card-info-details-box-start">
              <Clock style={{ 
                width: "24px", 
                height: "24px", 
                '--stroke-color': 'var(--black-color-opacity-30)', 
                '--stroke-width': '5px' 
              }} />
              <div className="bookNotificationUser-cards-card-info-details-box-start-time">
                <p className="bookNotificationUser-cards-card-info-details-box-start-time-text">Starts at</p>
                <p className="bookNotificationUser-cards-card-info-details-box-start-time-date">11:30 AM</p>
              </div> {/* bookNotificationUser-cards-card-info-details-box-start-time */}
            </div> {/* bookNotificationUser-cards-card-info-details-box-start */}

            <div className="bookNotificationUser-cards-card-info-details-box-end">
              <Clock style={{ 
                width: "24px", 
                height: "24px", 
                '--stroke-color': 'var(--black-color-opacity-30)', 
                '--stroke-width': '5px' 
              }} />
              <div className="bookNotificationUser-cards-card-info-details-box-end-time">
                <p className="bookNotificationUser-cards-card-info-details-box-end-time-text">Ends at</p>
                <p className="bookNotificationUser-cards-card-info-details-box-end-time-date">12:00 PM</p>
              </div> {/* bookNotificationUser-cards-card-info-details-box-end-time */}
            </div> {/* bookNotificationUser-cards-card-info-details-box-end */}
          </div> {/* bookNotificationUser-cards-card-info-details-box */}
        </div> {/* bookNotificationUser-cards-card-info-details */}
      </section> {/* bookNotificationUser-cards-card-info */}

      {/* <section className="bookNotificationUser-cards-card-role">
        <div className="bookNotificationUser-cards-card-role-title">
          <Circle_Primary style={{ color: "var(--primary-color)", width: "32px", height: "32px" }} />
          <p>Chief Engineer</p>
        </div> 
      </section>  */}

      {/* <section className="bookNotificationUser-cards-card-button">
        <button>
          <Edit_Pencil_01 style={{ color: "var(--white-color)", width: "32px", height: "32px", "--stroke-width": "2px" }} />
        </button>
      </section>  */}
    </main> 
  );
};

export default BookNotificationUser;
