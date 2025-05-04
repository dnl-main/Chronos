import React, { useEffect, useState } from 'react';
import './homeUser.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleAuthToken } from '../../utils/timeout';
import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Clock from '../../assets/icons/Clock.svg?react';
import BookAppointmentModal from '../../user/home/BookAppointmentModal';
import Spinner from '../../components/Spinner';

const HomeUser = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentStartTime, setAppointmentStartTime] = useState('');
  const [appointmentEndTime, setAppointmentEndTime] = useState('');
  const [appointmentLoading, setAppointmentLoading] = useState(true);

  const statusOptions = ['On Board', 'Available', 'Vacation'];

  useEffect(() => {
    const fetchAppointment = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.log('No token found, clearing appointment states');
        setAppointmentDate('');
        setAppointmentStartTime('');
        setAppointmentEndTime('');
        setAppointmentLoading(false);
        return;
      }

      try {
        console.time('fetchAppointment');
        console.log('Fetching appointment with token:', token);
        const response = await axios.get(`${apiUrl}/appointment`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API response:', response.data);
        console.timeEnd('fetchAppointment');

        const appointment = response.data.appointment || response.data;
        if (appointment && appointment.date) {
          setAppointmentDate(appointment.date || '');
          setAppointmentStartTime(appointment.startTime || appointment.start_time || '');
          setAppointmentEndTime(appointment.endTime || appointment.end_time || '');
          console.log('Appointment set:', {
            date: appointment.date,
            startTime: appointment.startTime || appointment.start_time,
            endTime: appointment.endTime || appointment.end_time,
          });
        } else {
          console.log('No appointment found in response, clearing states');
          setAppointmentDate('');
          setAppointmentStartTime('');
          setAppointmentEndTime('');
        }
      } catch (error) {
        console.error('Failed to fetch appointment:', error.response?.data || error.message);
        setAppointmentDate('');
        setAppointmentStartTime('');
        setAppointmentEndTime('');
      } finally {
        setAppointmentLoading(false);
      }
    };

    fetchAppointment();
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    handleAuthToken(token, storedUser ? JSON.parse(storedUser) : null, navigate);
    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'user') {
        navigate('/login');
        return;
      }
      setUser(parsedUser);
      setSelectedStatus(parsedUser.availability || 'Available');
    } else {
      fetchUserData(token);
    }

    setLoading(false);
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data;
      if (userData.role !== 'user') {
        navigate('/login');
        return;
      }
      setUser(userData);
      setSelectedStatus(userData.availability || 'Available');
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  useEffect(() => {
    const saveStatus = async () => {
      if (!user || selectedStatus === user.availability) return;

      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.patch(
          `${apiUrl}/user/availability`,
          { availability: selectedStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedUser = response.data.user;
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Status auto-saved:', updatedUser.availability);
        alert('Status updated successfully');
      } catch (error) {
        console.error('Failed to auto-save status:', error.response?.data || error.message);
        alert(error.response?.data.message || 'Failed to update status');
      }
    };

    saveStatus();
  }, [selectedStatus, user]);

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.warn('No token found, logging out anyway.');
        navigate('/');
        return;
      }
      await axios.post(
        `${apiUrl}/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/');
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const handleAppointmentSave = async () => {
    const appointment = {
      date: appointmentDate,
      startTime: appointmentStartTime,
      endTime: appointmentEndTime,
    };
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/appointment`,
        appointment,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const savedAppointment = response.data.appointment;
      setAppointmentDate(savedAppointment.date || '');
      setAppointmentStartTime(savedAppointment.startTime || '');
      setAppointmentEndTime(savedAppointment.endTime || '');
      setIsModalOpen(false);
      alert('Appointment saved successfully');
    } catch (error) {
      console.error('Failed to save appointment:', error.response?.data || error.message);
      alert(error.response?.data.message || 'Failed to save appointment');
    }
  };

  const handleDeleteAppointment = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`${apiUrl}/appointment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointmentDate('');
      setAppointmentStartTime('');
      setAppointmentEndTime('');
      alert('Appointment deleted successfully');
    } catch (error) {
      console.error('Failed to delete appointment:', error.response?.data || error.message);
      alert(error.response?.data.message || 'Failed to delete appointment');
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="homeUser">
      <div className="homeUser-box">
        <main className="homeUser-box-in">
          <div className="homeUser-top">
            <div className="homeUser-top-header">
              <div className="homeUser-top-header-left">
                <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                <header>Home</header>
              </div>

              {isModalOpen && (
                <BookAppointmentModal
                  onClose={() => setIsModalOpen(false)}
                  setAppointmentDate={setAppointmentDate}
                  setAppointmentStartTime={setAppointmentStartTime}
                  setAppointmentEndTime={setAppointmentEndTime}
                />
              )}

              <div className="homeUser-top-header-right">
                <div className="homeUser-top-header-right-status">
                  <main className="homeUser-top-header-right-status-in">
                    <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                    <select
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      style={{
                        padding: '4px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        background: '#fff',
                        fontSize: '14px',
                      }}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </main>
                </div>
              </div>
            </div>

            <div className="homeUser-top-core">
              <div className="homeUser-top-core-left">
                <div className="homeUser-top-core-left-header">
                  <header>Scheduled appointment</header>
                  <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                </div>

                {appointmentLoading ? (
                  <div className="homeUser-top-core-left-loading" style={{ padding: '1rem', textAlign: 'center' }}>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <div className="homeUser-top-core-left-heading">
                      {appointmentDate ? (
                        <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>You have an appointment</p>
                      ) : (
                        <p style={{ color: '#888', fontSize: '1.1rem' }}>No appointment scheduled</p>
                      )}
                    </div>

                    <div className="homeUser-top-core-left-date">
                      {appointmentDate ? (
                        <div className="homeUser-top-core-left-date-cal">
                          <p className="homeUser-top-core-left-date-cal-regular">
                            {new Date(appointmentDate).toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                          </p>
                          <p className="homeUser-top-core-left-date-cal-semibold">
                            {new Date(appointmentDate).getDate()}
                          </p>
                        </div>
                      ) : (
                        <div className="homeUser-top-core-left-date-cal">
                          <p className="homeUser-top-core-left-date-cal-regular">---</p>
                          <p className="homeUser-top-core-left-date-cal-semibold">--</p>
                        </div>
                      )}

                      <div className="homeUser-top-core-left-date-data">
                        {appointmentDate ? (
                          <>
                            <div className="homeUser-top-core-left-date-data-text">
                              <p className="homeUser-top-core-left-date-data-text-regular">{appointmentDate}</p>
                              <p className="homeUser-top-core-left-date-data-text-light">
                                {new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long' })}
                              </p>
                            </div>

                            <div className="homeUser-top-core-left-date-data-cards">
                              <div className="homeUser-top-core-left-date-data-cards-start">
                                <Clock
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    '--stroke-color': 'var(--black-color-opacity-30)',
                                    '--stroke-width': '5px'
                                  }}
                                />
                                <div className="homeUser-top-core-left-date-data-cards-start-text">
                                  <p className="homeUser-top-core-left-date-data-cards-start-text-light">Starts at</p>
                                  <p className="homeUser-top-core-left-date-data-cards-start-text-medium">
                                    {formatTime(appointmentStartTime)}
                                  </p>
                                </div>
                              </div>

                              <div className="homeUser-top-core-left-date-data-cards-end">
                                <Clock
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    '--stroke-color': 'var(--black-color-opacity-30)',
                                    '--stroke-width': '5px'
                                  }}
                                />
                                <div className="homeUser-top-core-left-date-data-cards-end-text">
                                  <p className="homeUser-top-core-left-date-data-cards-end-text-light">Ends at</p>
                                  <p className="homeUser-top-core-left-date-data-cards-end-text-medium">
                                    {formatTime(appointmentEndTime)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={handleDeleteAppointment}
                              style={{
                                marginTop: '1rem',
                                padding: '8px 12px',
                                background: '#f44336',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              Delete Appointment
                            </button>
                          </>
                        ) : (
                          <p style={{ padding: '1rem', fontStyle: 'italic' }}>
                            You have no scheduled appointment yet.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="homeUser-top-core-left-btn">
                      <button
                        className="homeUser-top-core-left-btn-button"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                        <p>Set appointment</p>
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="homeUser-top-core-right">
                <div className="homeUser-top-core-right-header">
                  <header>Certificate upload</header>
                  <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                </div>

                <div className="homeUser-top-core-right-progress">
                  <div className="homeUser-top-core-right-progress-text">
                    <p className="homeUser-top-core-right-progress-text-light">Your progress</p>
                    <div className="homeUser-top-core-right-progress-text-box">
                      <p className="homeUser-top-core-right-progress-text-box-regular">75% complete</p>
                      <p className="homeUser-top-core-right-progress-text-box-light">3 out of 4 uploaded</p>
                    </div>
                  </div>

                  <div className="homeUser-top-core-right-progress-bar">
                    <div className="homeUser-top-core-right-progress-bar-primary"></div>
                  </div>
                </div>

                <div className="homeUser-top-core-right-up">
                  <div className="homeUser-top-core-right-up-desc">
                    <div className="homeUser-top-core-right-up-desc-header">
                      <p>file upload</p>
                      <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                    </div>
                    <p className="homeUser-top-core-right-up-desc-light">Select the type of certificate</p>
                  </div>

                  <button className="homeUser-top-core-right-up-btn">
                    <div className="homeUser-top-core-right-up-btn-header">
                      <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                      <p>Medical</p>
                    </div>
                    <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                  </button>
                </div>

                <div className="homeUser-top-core-right-down">
                  <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                  <div className="homeUser-top-core-right-down-text">
                    <p className="homeUser-top-core-right-down-text-bold">Choose a file to upload</p>
                    <p className="homeUser-top-core-right-down-text-light">JPEG, PNG, and PDF formats, up to 50 MB</p>
                  </div>

                  <button className="homeUser-top-core-right-down-btn">
                    <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                    <p>Browse files</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="homeUser-bot">
            {/* Logout button remains commented out */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeUser;