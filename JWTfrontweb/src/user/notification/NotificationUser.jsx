import React from 'react';
import './notificationUser.css';

import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Bell from '../../assets/icons/Bell.svg?react';

import BookNotificationUser from './components/book/BookNotificationUser';
import CancelNotificationUser from './components/cancel/CancelNotificationUser';
import RescheduleNotificationUser from './components/reschedule/RescheduleNotificationUser';
import UploadNotificationUser from './components/upload/UploadNotificationUser';


const NotificationUser = () => {
  return (
    <div className="notificationUser">
    <div className="notificationUser-box">
      <main className="notificationUser-box-in">
        <header className="notificationUser-header">
          <Bell 
            style={{ 
              color: "var(--black-color)", 
              width: "32px", 
              height: "32px", 
              "--stroke-width": "5px"  
            }} 
          />
          <p>Notifications</p> 
        </header> {/* notificationUser-header */}

        <section className="notificationUser-tabs">
          <button className="notificationUser-tabs-all">
            <Circle_Primary style={{ color: "var(--white-color)", width: "20px", height: "20px" }} />
            <p>All</p>
          </button> {/* notificationUser-tabs-all */}

          <button className="notificationUser-tabs-rescheduled">
            <Circle_Primary style={{ color: "var(--primary-color)", width: "20px", height: "20px" }} />
            <p>Rescheduled</p>
          </button> {/* notificationUser-tabs-rescheduled */}

          <button className="notificationUser-tabs-canceled">
            <Circle_Primary style={{ color: "var(--primary-color)", width: "20px", height: "20px" }} />
            <p>Canceled</p>
          </button> {/* notificationUser-tabs-canceled */}

          <button className="notificationUser-tabs-uploaded">
            <Circle_Primary style={{ color: "var(--primary-color)", width: "20px", height: "20px" }} />
            <p>Uploaded</p>
          </button> {/* notificationUser-tabs-uploaded */}
        </section> {/* notificationUser-tabs */}

        <section className="notificationUser-container">
          <header className="notificationUser-header-recents">
            <p>Recents</p>
          </header> {/* notificationUser-header-recents */}

          <div className="notificationUser-cards">
            <BookNotificationUser />
            <CancelNotificationUser />
            <RescheduleNotificationUser />
            <UploadNotificationUser />
          </div> {/* notificationUser-cards */}
        </section>
      </main> {/* notificationUser-box-in */}
    </div> {/* notificationUser-box */}
    </div>
  );

};

export default NotificationUser;
