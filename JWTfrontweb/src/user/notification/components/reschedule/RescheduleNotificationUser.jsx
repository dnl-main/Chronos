import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './rescheduleNotificationUser.css';

import Calendar_Week from '../../../../assets/icons/Calendar_Week.svg?react';
import Clock from '../../../../assets/icons/Clock.svg?react';
import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';

const RescheduleNotificationUser = () => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/api/notifications', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setNotifications(response.data);
            } catch (error) {
                // console.error('Error fetching notifications:', error);
            }
        };
        fetchNotifications();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).replace(',', '').toUpperCase();
    };

    return (
        <>
            {notifications
                .filter((notif) => notif.type === 'App\\Notifications\\RescheduleNotification')
                .map((notif) => (
                    <main className="rescheduleNotificationUser-cards-card" key={notif.id}>
                        <section className="rescheduleNotificationUser-cards-card-indicator"></section>
                        <section className="rescheduleNotificationUser-cards-card-info">
                            <Circle_Primary style={{ color: 'var(--black-color)', width: '72px', height: '72px' }} />
                            <div className="rescheduleNotificationUser-cards-card-info-details">
                                <div className="rescheduleNotificationUser-cards-card-info-details-main">
                                    <p className="rescheduleNotificationUser-cards-card-info-details-main-name">
                                        {notif.data.user_name || 'Unknown User'}
                                    </p>
                                    <Circle_Primary
                                        style={{ color: 'var(--black-color-opacity-45)', width: '8px', height: '8px' }}
                                    />
                                    <p className="rescheduleNotificationUser-cards-card-info-details-main-time">
                                        {notif.created_at_human} -
                                    </p>
                                    <p className="rescheduleNotificationUser-cards-card-info-details-main-role">
                                        {notif.data.user_role || 'Unknown Role'}
                                    </p>
                                </div>
                                <div className="rescheduleNotificationUser-cards-card-info-details-sub">
                                    <p className="rescheduleNotificationUser-cards-card-info-details-sub-detail">
                                        Your appointment has been
                                    </p>
                                    <p className="rescheduleNotificationUser-cards-card-info-details-sub-name">Rescheduled</p>
                                </div>
                                <div className="rescheduleNotificationUser-cards-card-info-details-box">
                                    <div className="rescheduleNotificationUser-cards-card-info-details-box-date">
                                        <Calendar_Week
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                '--stroke-width': '2px',
                                                '--stroke-color': 'var(--black-color-opacity-30)',
                                            }}
                                        />
                                        <div className="rescheduleNotificationUser-cards-card-info-details-box-date-day">
                                            <p className="rescheduleNotificationUser-cards-card-info-details-box-date-day-day">
                                                {formatDate(notif.data.appointment_date).split(' ')[0]}
                                            </p>
                                            <p className="rescheduleNotificationUser-cards-card-info-details-box-date-day-date">
                                                {formatDate(notif.data.appointment_date).slice(4)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="rescheduleNotificationUser-cards-card-info-details-box-start">
                                        <Clock
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                '--stroke-color': 'var(--black-color-opacity-30)',
                                                '--stroke-width': '5px',
                                            }}
                                        />
                                        <div className="rescheduleNotificationUser-cards-card-info-details-box-start-time">
                                            <p className="rescheduleNotificationUser-cards-card-info-details-box-start-time-text">
                                                Starts at
                                            </p>
                                            <p className="rescheduleNotificationUser-cards-card-info-details-box-start-time-date">
                                                {notif.data.start_time}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="rescheduleNotificationUser-cards-card-info-details-box-end">
                                        <Clock
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                '--stroke-color': 'var(--black-color-opacity-30)',
                                                '--stroke-width': '5px',
                                            }}
                                        />
                                        <div className="rescheduleNotificationUser-cards-card-info-details-box-end-time">
                                            <p className="rescheduleNotificationUser-cards-card-info-details-box-end-time-text">
                                                Ends at
                                            </p>
                                            <p className="rescheduleNotificationUser-cards-card-info-details-box-end-time-date">
                                                {notif.data.end_time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                ))}
        </>
    );
};

export default RescheduleNotificationUser;