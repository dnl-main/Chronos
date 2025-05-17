import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './schedule.css';

import { Navbar } from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import ScheduleCard from './scheduleComponents/ScheduleCard';
import Spinner from '../../components/Spinner';

import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Calendar_Event from '../../assets/icons/Calendar_Event.svg?react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Schedule = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        navigate(parsedUser.role === 'user' ? '/user/homeuser' : '/login');
        return;
      }
      fetchAppointments(token);
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
      if (userData.role !== 'admin') {
        navigate(userData.role === 'user' ? '/user/homeuser' : '/login');
        return;
      }
      sessionStorage.setItem('user', JSON.stringify(userData));
      fetchAppointments(token);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError('Failed to load user data. Please log in again.');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async (token) => {
    try {
      setError(null);
      const response = await axios.get(`${apiUrl}/appointment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(Array.isArray(response.data) ? response.data : [response.data].filter(Boolean));
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      if (error.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
        navigate('/login');
      } else {
        setError('Failed to load appointments.');
      }
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) return <Spinner />;
  if (error) return <div className="schedule-error">{error}</div>;




  return (
    <div className="schedule">
      <div className="schedule-box">
        <main className="schedule-box-in">
          <header className="schedule-header">
            <Calendar_Event
              style={{
                color: "var(--black-color)",
                width: "32px",
                height: "32px",
                "--stroke-width": "4px",
              }}
            />
            <p>Scheduled appointments</p>
          </header>

          {/* Tabs */}
          <section className="schedule-tabs">
            <button
              className={`schedule-tabs-all ${selectedTab === 'all' ? 'schedule-tab-active' : ''}`}
              onClick={() => setSelectedTab('all')}
            >
              <Circle_Primary style={{ width: "20px", height: "20px" }} />
              <p>All</p>
            </button>
            <button
              className={`schedule-tabs-today ${selectedTab === 'today' ? 'schedule-tab-active' : ''}`}
              onClick={() => setSelectedTab('today')}
            >
              <Circle_Primary style={{ width: "20px", height: "20px" }} />
              <p>Today</p>
            </button>
            <button
              className={`schedule-tabs-upcoming ${selectedTab === 'upcoming' ? 'schedule-tab-active' : ''}`}
              onClick={() => setSelectedTab('upcoming')}
            >
              <Circle_Primary style={{ width: "20px", height: "20px" }} />
              <p>Upcoming</p>
            </button>
            <button
              className={`schedule-tabs-completed ${selectedTab === 'completed' ? 'schedule-tab-active' : ''}`}
              onClick={() => setSelectedTab('completed')}
            >
              <Circle_Primary style={{ width: "20px", height: "20px" }} />
              <p>Completed</p>
            </button>
          </section>

          {/* Today Section */}
          {(selectedTab === 'today' || selectedTab === 'all') && (
            <>
              <header className="schedule-header-today">
                <p>Today</p>
              </header>
              <section className="schedule-today">
                <div className="schedule-today-cards">
                  {appointments
                    .filter(app => app.date === today && app.status !== 'completed')
                    .map(app => (
                      <ScheduleCard key={app.id} appointment={app} user={app.user} />
                    ))}
                </div>
              </section>
            </>
          )}

          {/* Upcoming Section */}
          {(selectedTab === 'upcoming' || selectedTab === 'all') && (
            <>
              <header className="schedule-header-today">
                <p>Upcoming</p>
              </header>
              <section className="schedule-today">
                <div className="schedule-today-cards">
                  {appointments
                    .filter(app => app.date > today && app.status !== 'completed')
                    .map(app => (
                      <ScheduleCard key={app.id} appointment={app} user={app.user} />
                    ))}
                </div>
              </section>
            </>
          )}

          {/* Completed Section */}
          {(selectedTab === 'all' || selectedTab === 'completed') && (
            <>
              <header className="schedule-header-completed">
                <p>Completed</p>
              </header>
              <section className="schedule-today">
                <div className="schedule-today-cards">
                  <p style={{ color: '#888', padding: '1rem' }}>No results found.</p>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Schedule;