import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './uploadNotificationUser.css';
import Calendar_Week from '../../../../assets/icons/Calendar_Week.svg?react';
import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const UploadNotificationUser = ({ notification, onDelete }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // console.log('Notification prop:', notification); // Debug
        const fetchUser = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${apiUrl}/users/${notification.user_id}`, {
            headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true' // Add this to bypass ngrok warning
      },
                    withCredentials: true,
                });
                // console.log('User fetched:', response.data); // Debug
                setUser(response.data);
            } catch (err) {
                // console.error('Failed to fetch user:', err);
            }
        };

        if (notification.user_id) {
            fetchUser();
        }
    }, [notification.user_id]);

    const handleDelete = async () => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`${apiUrl}/notifications/${notification.id}`, {
           headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true' // Add this to bypass ngrok warning
      },
                withCredentials: true,
            });
            // console.log('Notification deleted:', notification.id); // Debug
            onDelete(notification.id); // Notify parent to refresh
            alert('Notification deleted successfully'); // Replace with toast in production
        } catch (err) {
            // console.error('Failed to delete notification:', err);
            alert('Failed to delete notification');
        }
    };

    // Determine display text based on certificate type
    const displayCertificateType = notification.certificate_type?.toLowerCase() === 'contract' || 
                                 notification.certificate_type?.toLowerCase() === 'id' 
                                 ? notification.certificate_type 
                                 : `${notification.certificate_type || 'Unknown'} Certificate`;

    return (
        <main className="uploadNotificationUser-cards-card">
            <section className="uploadNotificationUser-cards-card-indicator"></section>
            <section className="uploadNotificationUser-cards-card-info">
                <Circle_Primary style={{ color: "var(--black-color)", width: "72px", height: "72px" }} />
                <div className="uploadNotificationUser-cards-card-info-details">
                    <div className="uploadNotificationUser-cards-card-info-details-main">
                        <p className="uploadNotificationUser-cards-card-info-details-main-name">
                            {user ? [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ') : 'Loading...'}
                        </p>
                        <Circle_Primary style={{ color: "var(--black-color-opacity-45)", width: "8px", height: "8px" }} />
                        <p className="uploadNotificationUser-cards-card-info-details-main-time">
                            {notification.created_at ? new Date(notification.created_at).toLocaleString() : 'N/A'} -
                        </p>
                    </div>
                    <div className="uploadNotificationUser-cards-card-info-details-sub">
                        <p className="uploadNotificationUser-cards-card-info-details-sub-detail">Please upload your</p>
                        <p className="uploadNotificationUser-cards-card-info-details-sub-name">
                            {displayCertificateType}
                        </p>
                    </div>
                    <div className="uploadNotificationUser-cards-card-info-details-box">
                        <div className="uploadNotificationUser-cards-card-info-details-box-date">
                            <Calendar_Week
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    '--stroke-width': '2px',
                                    '--stroke-color': 'var(--black-color-opacity-30)'
                                }}
                            />
                            <div className="uploadNotificationUser-cards-card-info-details-box-date-day">
                                <p className="uploadNotificationUser-cards-card-info-details-box-date-day-day">Certificate</p>
                                <p className="uploadNotificationUser-cards-card-info-details-box-date-day-date">
                                    {displayCertificateType}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default UploadNotificationUser;