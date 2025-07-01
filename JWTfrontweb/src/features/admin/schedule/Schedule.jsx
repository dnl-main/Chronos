//Dependencies import
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

//Components import 
import ScheduleCard from './cards/ScheduleCard';
import Spinner from '../../../components/ui/Spinner';
import ManageAppointment from '../components/modals/appointment/editAppointment/EditAppointment';

//CSS import
import './schedule.css';

//Icon import
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import Calendar_Event from '../../../assets/icons/Calendar_Event.svg?react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Schedule = () => {  
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'today' || tabParam === 'upcoming' || tabParam === 'all' || tabParam === 'pending') {
      setSelectedTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'user') {
        navigate('/user/homeuser');
        return;
      }
      if (parsedUser.role !== 'admin') {
        navigate('/login');
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
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      const userData = response.data;
      if (userData.role !== 'admin') {
        navigate(userData.role === 'user' ? '/user/homeuser' : '/login');
        return;
      }
      sessionStorage.setItem('user', JSON.stringify(userData));
      fetchAppointments(token);
    } catch (error) {
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
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      setAppointments(Array.isArray(response.data) ? response.data : [response.data].filter(Boolean));
    } catch (error) {
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

  const handleEditClick = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
    fetchAppointments(sessionStorage.getItem('token')); // Refresh appointments after modal closes
  };

  // Normalize date to YYYY-MM-DD format for consistent comparison
  const normalizeDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Sort appointments by date in ascending order
  const sortAppointmentsByDate = (a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
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
              className={`schedule-tabs-pending ${selectedTab === 'pending' ? 'schedule-tab-active' : ''}`}
              onClick={() => setSelectedTab('pending')}
            >
              <Circle_Primary style={{ width: "20px", height: "20px" }} />
              <p>Pending</p>
            </button>
            {/* <button
              className={`schedule-tabs-completed ${selectedTab === 'completed' ? 'schedule-tab-active' : ''}`}
              onClick={() => setSelectedTab('completed')}
            >
              <Circle_Primary style={{ width: "20px", height: "20px" }} />
              <p>Completed</p>
            </button> */}
          </section>

          {(selectedTab === 'today' || selectedTab === 'all') && (
            <>
              <header className="schedule-header-today">
                <p>Today</p>
              </header>
              <section className="schedule-today">
                <div className="schedule-today-cards">
                  {appointments
                    .filter((app) => normalizeDate(app.date) === today && app.status !== 'completed' && app.status !== 'pending')
                    .sort(sortAppointmentsByDate)
                    .map((app) => (
                      <ScheduleCard
                        key={app.id}
                        appointment={app}
                        user={app.user}
                        allAppointments={appointments}
                        onEditClick={handleEditClick}
                      />
                    ))}
                  {appointments.filter((app) => normalizeDate(app.date) === today && app.status !== 'completed' && app.status !== 'pending').length === 0 && (
                    <p style={{ color: '#888', padding: '1rem' }}>No appointments today.</p>
                  )}
                </div>
              </section>
            </>
          )}

          {(selectedTab === 'upcoming' || selectedTab === 'all') && (
            <>
              <header className="schedule-header-today">
                <p>Upcoming</p>
              </header>
              <section className="schedule-today">
                <div className="schedule-today-cards">
                  {appointments
                    .filter((app) => normalizeDate(app.date) > today && app.status !== 'completed' && app.status !== 'pending')
                    .sort(sortAppointmentsByDate)
                    .map((app) => (
                      <ScheduleCard
                        key={app.id}
                        appointment={app}
                        user={app.user}
                        allAppointments={appointments}
                        onEditClick={handleEditClick}
                      />
                    ))}
                  {appointments.filter((app) => normalizeDate(app.date) > today && app.status !== 'completed' && app.status !== 'pending').length === 0 && (
                    <p style={{ color: '#888', padding: '1rem' }}>No upcoming appointments.</p>
                  )}
                </div>
              </section>
            </>
          )}

          {(selectedTab === 'pending' || selectedTab === 'all') && (
            <>
              <header className="schedule-header-today">
                <p>Pending</p>
              </header>
              <section className="schedule-today">
                <div className="schedule-today-cards">
                  {appointments
                    .filter((app) => app.status === 'pending' && normalizeDate(app.date) >= today)
                    .sort(sortAppointmentsByDate)
                    .map((app) => (
                      <ScheduleCard
                        key={app.id}
                        appointment={app}
                        user={app.user}
                        allAppointments={appointments}
                        onEditClick={handleEditClick}
                      />
                    ))}
                  {appointments.filter((app) => app.status === 'pending' && normalizeDate(app.date) >= today).length === 0 && (
                    <p style={{ color: '#888', padding: '1rem' }}>No pending appointments.</p>
                  )}
                </div>
              </section>
            </>
          )}

          {/* {(selectedTab === 'all' || selectedTab === 'completed') && (
            <>
              <header className="schedule-header-completed">
                <p>Completed</p>
              </header>
              <section className="schedule-today">
                <div className="schedule-today-cards">
                  {appointments
                    .filter((app) => app.status === 'completed')
                    .sort(sortAppointmentsByDate)
                    .map((app) => (
                      <ScheduleCard
                        key={app.id}
                        appointment={app}
                        user={app.user}
                        allAppointments={appointments}
                        onEditClick={handleEditClick}
                      />
                    ))}
                  {appointments.filter((app) => app.status === 'completed').length === 0 && (
                    <p style={{ color: '#888', padding: '1rem' }}>No completed appointments.</p>
                  )}
                </div>
              </section>
            </>
          )} */}
        </main>
      </div>

      {isModalOpen && modalData && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '80%',
            maxHeight: '80%',
            overflowY: 'auto',
          }}>
            <ManageAppointment
              appointment={modalData.appointment}
              user={modalData.user}
              bookedAppointments={modalData.bookedAppointments}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;