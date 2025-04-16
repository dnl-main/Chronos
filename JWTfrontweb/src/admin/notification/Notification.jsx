import './notification.css';
// nav
import { Navbar } from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import NotificationCard from './notificationComponent/NotificationCard';
// icons
import Calendar_Event from '../../assets/icons/Calendar_Event.svg?react';
import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Edit_Pencil_01 from '../../assets/icons/Edit_Pencil_01.svg?react';
import Bell from '../../assets/icons/Bell.svg?react';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Notification = () => {
    const [overlayContent, setOverlayContent] = useState(null);
    const navigate = useNavigate(); 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
    
      if (!token) {
        navigate('/login');
        return;
      }
    
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === 'user') {
          navigate('/homeuser');
          return;
        }
        if (parsedUser.role !== 'admin') {
          navigate('/login');
          return;
        }
        setUser(parsedUser);
        setLoading(false);
      } else {
        fetchUserData(token);
      }
    }, [navigate]);
    
    const fetchUserData = async (token) => {
      try {
        const response = await axios.get(`${apiUrl}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const userData = response.data;
    
        if (userData.role === 'user') {
          navigate('/homeuser');
          return;
        }
        if (userData.role !== 'admin') {
          navigate('/login');
          return;
        }
    
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    if (loading) { //BLOCK TO
      return null; 
    }
  return (
    <div className="notification">
    <Navbar />
    <Sidebar />
    <div className="notification-box">
      <main className="notification-box-in">
        <header className="notification-header">
          <Bell 
            style={{ 
              color: "var(--black-color)", 
              width: "32px", 
              height: "32px", 
              "--stroke-width": "5px"  
            }} 
          />
          <p>Notifications</p> 
        </header> {/* notification-header */}

        <section className="notification-tabs">
          <button className="notification-tabs-all">
            <Circle_Primary style={{ color: "var(--white-color)", width: "20px", height: "20px" }} />
            <p>All</p>
          </button> {/* notification-tabs-all */}

          <button className="notification-tabs-rescheduled">
            <Circle_Primary style={{ color: "var(--primary-color)", width: "20px", height: "20px" }} />
            <p>Rescheduled</p>
          </button> {/* notification-tabs-rescheduled */}

          <button className="notification-tabs-canceled">
            <Circle_Primary style={{ color: "var(--primary-color)", width: "20px", height: "20px" }} />
            <p>Canceled</p>
          </button> {/* notification-tabs-canceled */}

          <button className="notification-tabs-uploaded">
            <Circle_Primary style={{ color: "var(--primary-color)", width: "20px", height: "20px" }} />
            <p>Uploaded</p>
          </button> {/* notification-tabs-uploaded */}
        </section> {/* notification-tabs */}

        <section className="notification-container">
          <header className="notification-header-recents">
            <p>Recents</p>
          </header> {/* notification-header-recents */}

          <div className="notification-cards">
            <NotificationCard />
            <NotificationCard />
            <NotificationCard /> 
          </div> {/* notification-cards */}
        </section>
      </main> {/* notification-box-in */}
    </div> {/* notification-box */}
    </div>
  );
};

export default Notification;
