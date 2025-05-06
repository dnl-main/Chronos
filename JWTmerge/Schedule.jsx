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
  const [activeFilter, setActiveFilter] = useState('all');

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
      console.log('Fetching user data from:', `${apiUrl}/user`);
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
      console.log('Fetching appointments from:', `${apiUrl}/appointment`);
      const response = await axios.get(`${apiUrl}/appointment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Appointments response:', response.data);
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

  const filterAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeFilter) {
      case 'today':
        return appointments.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate.getTime() === today.getTime();
        });
      case 'upcoming':
        return appointments.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate > today && appointment.status !== 'completed';
        });
      case 'completed':
        return appointments.filter(appointment => appointment.status === 'completed');
      case 'all':
      default:
        return appointments;
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  if (loading) return <Spinner />;
  if (error) return <div className="schedule-error">{error}</div>;

  const filteredAppointments = filterAppointments();

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
          <section className="schedule-tabs">
            <button 
              className={`schedule-tabs-all ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              <Circle_Primary 
                style={{ 
                  color: activeFilter === 'all' ? 'var(--white-color)' : 'var(--primary-color)', 
                  width: '20px', 
                  height: '20px' 
                }} 
              />
              <p>All</p>
            </button>
            <button 
              className={`schedule-tabs-today ${activeFilter === 'today' ? 'active' : ''}`}
              onClick={() => handleFilterChange('today')}
            >
              <Circle_Primary 
                style={{ 
                  color: activeFilter === 'today' ? 'var(--white-color)' : 'var(--primary-color)', 
                  width: '20px', 
                  height: '20px' 
                }} 
              />
              <p>Today</p>
            </button>
            <button 
              className={`schedule-tabs-upcoming ${activeFilter === 'upcoming' ? 'active' : ''}`}
              onClick={() => handleFilterChange('upcoming')}
            >
              <Circle_Primary 
                style={{ 
                  color: activeFilter === 'upcoming' ? 'var(--white-color)' : 'var(--primary-color)', 
                  width: '20px', 
                  height: '20px' 
                }} 
              />
              <p>Upcoming</p>
            </button>
            <button 
              className={`schedule-tabs-completed ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => handleFilterChange('completed')}
            >
              <Circle_Primary 
                style={{ 
                  color: activeFilter === 'completed' ? 'var(--white-color)' : 'var(--primary-color)', 
                  width: '20px', 
                  height: '20px' 
                }} 
              />
              <p>Completed</p>
            </button>
          </section>

          <section className="schedule-content">
            <div className="schedule-cards">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <ScheduleCard
                    key={appointment.id}
                    appointment={appointment}
                    user={appointment.user}
                  />
                ))
              ) : (
                <p>No appointments found</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Schedule;