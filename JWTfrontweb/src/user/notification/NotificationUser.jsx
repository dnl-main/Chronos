import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './notificationUser.css';
import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Bell from '../../assets/icons/Bell.svg?react';
import UploadNotificationUser from './components/upload/UploadNotificationUser';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const NotificationUser = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedTab, setSelectedTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            const token = sessionStorage.getItem('token');
            // console.log('Token:', token); // Debug
            if (!token) {
                setError('Please log in to view notifications');
                setLoading(false);
                return;
            }
            const response = await axios.get(`${apiUrl}/notifications`, {
  headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true' // Add this to bypass ngrok warning
      },
                withCredentials: true,
            });
            // console.log('Notifications fetched:', response.data); // Debug
            setNotifications(response.data);
            setLoading(false);
        } catch (err) {
            // console.error('Fetch notifications error:', err);
            if (err.response?.status === 401) {
                setError('Session expired. Please log in again.');
                sessionStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                setError('Failed to load notifications');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleDelete = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    const filteredNotifications = notifications.filter(notification => {
        // console.log('Filtering notification:', notification); // Debug
        if (selectedTab === 'all') return true;
        if (selectedTab === 'uploaded') return !!notification.certificate_type;
        return false;
    });

    const renderNotification = (notification) => (
        <UploadNotificationUser
            key={notification.id}
            notification={notification}
            onDelete={handleDelete}
        />
    );

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
                    </header>

                    <section className="notificationUser-tabs">
                        {['all', 'rescheduled', 'canceled', 'uploaded'].map(tab => (
                            <button
                                key={tab}
                                className={`notificationUser-tabs-${tab} ${selectedTab === tab ? 'active' : ''}`}
                                onClick={() => setSelectedTab(tab)}
                            >
                                <Circle_Primary
                                    style={{
                                        color: selectedTab === tab ? "var(--white-color)" : "var(--primary-color)",
                                        width: "20px",
                                        height: "20px"
                                    }}
                                />
                                <p>{tab.charAt(0).toUpperCase() + tab.slice(1)}</p>
                            </button>
                        ))}
                    </section>

                    <section className="notificationUser-container">
                        <header className="notificationUser-header-recents">
                            <p>Recents</p>
                        </header>

                        <div className="notificationUser-cards">
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : filteredNotifications.length === 0 ? (
                                <p>None</p>
                            ) : (
                                filteredNotifications.map(renderNotification)
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NotificationUser;