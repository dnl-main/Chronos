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
  const [certificateName, setCertificateName] = useState('');
  const [certificateType, setCertificateType] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState({ percentage: 0, uploaded: 0, total: 4 });
  const [certificateLoading, setCertificateLoading] = useState(true);

  const statusOptions = ['On Board', 'Available', 'Vacation'];
  const certificateTypes = ['Medical', 'Training','Contract','Employee ID'];

  // Fetch user certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setProgress({ percentage: 0, uploaded: 0, total: 4 });
        setCertificateLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/certificates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const certificates = response.data.certificates || [];
        const uploaded = certificates.length;
        const total = 4; // Adjust based on your requirements
        const percentage = Math.round((uploaded / total) * 100);
        setProgress({ percentage, uploaded, total });
      } catch (error) {
        console.error('Failed to fetch certificates:', error.response?.data || error.message);
        alert(error.response?.data.message || 'Failed to load certificates');
      } finally {
        setCertificateLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Existing useEffect for appointments
  useEffect(() => {
    const fetchAppointment = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setAppointmentDate('');
        setAppointmentStartTime('');
        setAppointmentEndTime('');
        setAppointmentLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/appointment`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const appointment = response.data.appointment || response.data;
        if (appointment && appointment.date) {
          setAppointmentDate(appointment.date || '');
          setAppointmentStartTime(appointment.startTime || appointment.start_time || '');
          setAppointmentEndTime(appointment.endTime || appointment.end_time || '');
        } else {
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

  // Existing useEffect for user data
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
        navigate('/');
        return;
      }
      await axios.post(`${apiUrl}/logout`, {}, { headers: { Authorization: `Bearer ${token}` } });
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/');
    } catch (error) {
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
      const response = await axios.post(`${apiUrl}/appointment`, appointment, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // Handle certificate upload
  const handleCertificateSubmit = async (e) => {
    e.preventDefault();

    if (!file || !certificateName || !certificateType) {
      alert('Please fill all required fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('certificate_name', certificateName);
    formData.append('certificate_type', certificateType);
    if (expirationDate) {
      formData.append('expiration_date', expirationDate);
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/upload-certificate`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Certificate uploaded successfully!');
      setCertificateName('');
      setCertificateType('');
      setExpirationDate('');
      setFile(null);

      // Update progress
      const uploaded = progress.uploaded + 1;
      const total = progress.total;
      const percentage = Math.round((uploaded / total) * 100);
      setProgress({ percentage, uploaded, total });
    } catch (error) {
      console.error('Failed to upload certificate:', error.response?.data || error.message);
      alert(error.response?.data.message || 'Failed to upload certificate');
    }
  };

  if (loading) return null;

  return (
    <div className="homeUser">
      <div className="homeUser-box">
        <main className="homeUser-box-in">
          <div className="homeUser-top">
            <div className="homeUser-top-header">
              <div className="homeUser-top-header-left">
                <Circle_Primary style={{ width: '20px', height: '20px' }} />
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
                <div
                  className="homeUser-top-header-right-status"
                  style={{
                    backgroundColor:
                      selectedStatus === 'Available'
                        ? '#36C081'
                        : selectedStatus === 'On Board'
                        ? '#FFDC6C'
                        : selectedStatus === 'Vacation'
                        ? '#FA6464'
                        : '#fff',
                    borderRadius: '50px',
                    padding: '6px',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <main className="homeUser-top-header-right-status-in">
                    <Circle_Primary style={{ width: '20px', height: '20px' }} />
                    <select
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      style={{
                        padding: '4px 8px',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: 'inherit',
                        color: '#000',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
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
                                    '--stroke-width': '5px',
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
                                    '--stroke-width': '5px',
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
                      {!appointmentDate && (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="homeUser-top-core-left-btn-button"
                        >
                          <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                          Set Appointment
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="homeUser-top-core-right">
                <div className="homeUser-top-core-right-header">
                  <header>Certificate upload</header>
                  <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                </div>

                {certificateLoading ? (
                  <div className="homeUser-top-core-right-loading" style={{ padding: '1rem', textAlign: 'center' }}>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <div className="homeUser-top-core-right-progress">
                      <div className="homeUser-top-core-right-progress-text">
                        <p className="homeUser-top-core-right-progress-text-light">Your progress</p>
                        <div className="homeUser-top-core-right-progress-text-box">
                          <p className="homeUser-top-core-right-progress-text-box-regular">{progress.percentage}% complete</p>
                          <p className="homeUser-top-core-right-progress-text-box-light">{progress.uploaded} out of {progress.total} uploaded</p>
                        </div>
                      </div>

                      <div className="homeUser-top-core-right-progress-bar">
                        <div
                          className="homeUser-top-core-right-progress-bar-primary"
                          style={{ width: `${progress.percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <form onSubmit={handleCertificateSubmit} className="homeUser-top-core-right-form">
                      <div className="homeUser-top-core-right-up">
                        <div className="homeUser-top-core-right-up-desc">
                          <div className="homeUser-top-core-right-up-desc-header">
                            <p>File upload</p>
                            <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                          </div>
                          <p className="homeUser-top-core-right-up-desc-light"></p>
                        </div>

                        <select
                          value={certificateType}
                          onChange={(e) => setCertificateType(e.target.value)}
                          className="homeUser-top-core-right-input" // Changed to match input class
                          required
                        >
                          <option value="" disabled>Select certificate type</option>
                          {certificateTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          value={certificateName}
                          onChange={(e) => setCertificateName(e.target.value)}
                          placeholder="Certificate Name"
                          className="homeUser-top-core-right-input"
                          required
                        />

                        <input
                          type="date"
                          value={expirationDate}
                          onChange={(e) => setExpirationDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]} // Prevent past dates
                          className="homeUser-top-core-right-input"
                        />
                      </div>

                      <div className="homeUser-top-core-right-down">
                        <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                        <div className="homeUser-top-core-right-down-text">
                          <p className="homeUser-top-core-right-down-text-bold">Choose a file to upload</p>
                          <p className="homeUser-top-core-right-down-text-light">PDF format, up to 30 MB</p>
                        </div>

                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setFile(e.target.files[0])}
                          className="homeUser-top-core-right-down-btn"
                          required
                        />

                        <button type="submit" className="homeUser-top-core-right-down-btn">
                          <Circle_Primary style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                          Upload Certificate
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="homeUser-bot"></div>
        </main>
      </div>
    </div>
  );
};

export default HomeUser;