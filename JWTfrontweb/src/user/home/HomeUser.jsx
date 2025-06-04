import React, { useEffect, useState } from 'react';
import './homeUser.css';
import './homeUserMQ.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleAuthToken } from '../../utils/timeout';
import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Clock from '../../assets/icons/Clock.svg?react';
import House_01 from '../../assets/icons/House_01.svg?react';
import Users from '../../assets/icons/Users.svg?react';
import Book from '../../assets/icons/Book.svg?react';
import Cloud_Upload from '../../assets/icons/Cloud_Upload.svg?react';
import File_Add from '../../assets/icons/File_Add.svg?react';
import Folder_Open from '../../assets/icons/Folder_Open.svg?react';
import Check from '../../assets/icons/Check.svg?react';
import BookAppointmentModal from '../../user/home/BookAppointmentModal';
import Spinner from '../../components/Spinner';

const HomeUser = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [appointment, setAppointment] = useState({
    
    date: '',
    start_time: '',
    end_time: '',
    department: '',
    crewing_dept: '',
    operator: '',
    accounting_task: '',
    employee: '',
    purpose: '',
  });
  const [appointmentLoading, setAppointmentLoading] = useState(true);
  const [certificateName, setCertificateName] = useState('');
  const [certificateType, setCertificateType] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState({ percentage: 0, uploaded: 0, total: 4 });
  const [certificateLoading, setCertificateLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const statusOptions = ['On Board', 'Available', 'Vacation'];
  const certificateTypes = ['Medical', 'Training', 'Contract', 'Employee ID'];

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
          headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
        });
        const certificates = response.data.certificates || [];
        const uploaded = certificates.length;
        const total = 4;
        const percentage = Math.round((uploaded / total) * 100);
        setProgress({ percentage, uploaded, total });
      } catch (error) {
        alert(error.response?.data.message || 'Failed to load certificates');
      } finally {
        setCertificateLoading(false);
      }
    };

    fetchCertificates();
  }, [apiUrl]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointment = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setAppointment({
        
          date: '',
          start_time: '',
          end_time: '',
          department: '',
          crewing_dept: '',
          operator: '',
          accounting_task: '',
          employee: '',
          purpose: '',
        });
        setAppointmentLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/appointment`, {
          headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
        });

        const appointmentData = Array.isArray(response.data) ? response.data[0] : response.data;
        if (appointmentData && appointmentData.date) {
          setAppointment({
            id: appointmentData.id || null,
            date: appointmentData.date || '',
            start_time: appointmentData.start_time || '',
            end_time: appointmentData.end_time || '',
            department: appointmentData.department || '',
            crewing_dept: appointmentData.crewing_dept || '',
            operator: appointmentData.operator || '',
            accounting_task: appointmentData.accounting_task || '',
            employee: appointmentData.employee || '',
            purpose: appointmentData.purpose || '',
          });
        } else {
          setAppointment({
            id: null,
            date: '',
            start_time: '',
            end_time: '',
            department: '',
            crewing_dept: '',
            operator: '',
            accounting_task: '',
            employee: '',
            purpose: '',
          });
        }
      } catch (error) {
        setAppointment({
          id: null,
          date: '',
          start_time: '',
          end_time: '',
          department: '',
          crewing_dept: '',
          operator: '',
          accounting_task: '',
          employee: '',
          purpose: '',
        });
      } finally {
        setAppointmentLoading(false);
      }
    };

    fetchAppointment();
  }, [apiUrl]);

  // Fetch user data
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
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
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
          { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } }
        );
        const updatedUser = response.data.user;
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Status updated successfully');
      } catch (error) {
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
      await axios.post(`${apiUrl}/logout`, {}, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } });
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

  const handleAppointmentBooked = (appointment) => {
    setAppointment({
      id: appointment.id || null,
      date: appointment.date || '',
      start_time: appointment.start_time || '',
      end_time: appointment.end_time || '',
      department: appointment.department || '',
      crewing_dept: appointment.crewing_dept || '',
      operator: appointment.operator || '',
      accounting_task: appointment.accounting_task || '',
      employee: appointment.employee || '',
      purpose: appointment.purpose || '',
    });
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleDeleteAppointment = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`${apiUrl}/appointment`, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
      setAppointment({
        id: null,
        date: '',
        start_time: '',
        end_time: '',
        department: '',
        crewing_dept: '',
        operator: '',
        accounting_task: '',
        employee: '',
        purpose: '',
      });
      alert('Appointment deleted successfully');
    } catch (error) {
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

    const token = sessionStorage.getItem('token');
    try {
      const certResponse = await axios.get(`${apiUrl}/certificates`, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
      const existingCert = certResponse.data.certificates.find(
        (cert) => cert.certificate_type === certificateType
      );

      if (existingCert) {
        const confirmReplace = window.confirm(
          `A ${certificateType} certificate already exists. Uploading a new one will replace the existing certificate. Do you want to proceed?`
        );
        if (!confirmReplace) return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('certificate_name', certificateName);
      formData.append('certificate_type', certificateType);
      if (expirationDate) {
        formData.append('expiration_date', expirationDate);
      }

      const response = await axios.post(`${apiUrl}/upload-certificate`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      alert('Certificate uploaded successfully!');
      setCertificateName('');
      setCertificateType('');
      setExpirationDate('');
      setFile(null);

      const updatedCertResponse = await axios.get(`${apiUrl}/certificates`, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
      const certificates = updatedCertResponse.data.certificates || [];
      const uploaded = certificates.length;
      const total = 4;
      const percentage = Math.round((uploaded / total) * 100);
      setProgress({ percentage, uploaded, total });
    } catch (error) {
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
                <House_01
                  style={{
                    width: '30px',
                    height: '30px',
                    '--stroke-color': 'var(--black-color)',
                    '--stroke-width': '3px',
                    '--fill-color': 'none',
                  }}
                />
                <header>Home</header>
              </div>

              {isModalOpen && (
                <BookAppointmentModal
                  onClose={() => setIsModalOpen(false)}
                  onAppointmentBooked={handleAppointmentBooked}
                />
              )}
              {isRescheduleModalOpen && (
                <BookAppointmentModal
                  onClose={() => setIsRescheduleModalOpen(false)}
                  onAppointmentBooked={handleAppointmentBooked}
                  appointment={appointment}
                  isReschedule={true}
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
                        ? 'var(--red-indicator)'
                        : selectedStatus === 'Vacation'
                        ? 'var(--yellow-indicator)'
                        : '#fff',
                    borderRadius: '50px',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <main className="homeUser-top-header-right-status-in">
                    <Circle_Primary style={{ width: '20px', height: '20px' }} />
                    <select
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      style={{
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
                  <Users style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
                </div>

                {appointmentLoading ? (
                  <div className="homeUser-top-core-left-loading" style={{ padding: '1rem', textAlign: 'center' }}>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <div className="homeUser-top-core-left-heading">
                      <p style={{ color: appointment.date ? '#000' : '#888' }}>
                        {appointment.date ? 'You have an appointment' : 'No appointment scheduled'}
                      </p>
                    </div>

                    <div className="homeUser-top-core-left-date">
                      <div className="homeUser-top-core-left-date-cal">
                        <p className="homeUser-top-core-left-date-cal-regular">
                          {appointment.date
                            ? new Date(appointment.date).toLocaleString('en-US', { month: 'short' }).toUpperCase()
                            : '---'}
                        </p>
                        <p className="homeUser-top-core-left-date-cal-semibold">
                          {appointment.date ? new Date(appointment.date).getDate() : '--'}
                        </p>
                      </div>

                      <div className="homeUser-top-core-left-date-data">
                        {appointment.date ? (
                          <>
                            <div className="homeUser-top-core-left-date-data-text">
                              <p className="homeUser-top-core-left-date-data-text-regular">{appointment.date}</p>
                              <p className="homeUser-top-core-left-date-data-text-light">
                                {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long' })}
                              </p>
                              <p className="homeUser-top-core-left-date-data-text-light">
                                Department: {appointment.department ? capitalize(appointment.department) : 'N/A'}
                              </p>

                              {appointment.department === 'crewing' && (
                                <>
                                  <p className="homeUser-top-core-left-date-data-text-light">
                                    Crewing Dept: {appointment.crewing_dept ? capitalize(appointment.crewing_dept) : 'N/A'}
                                  </p>
                                  <p className="homeUser-top-core-left-date-data-text-light">
                                    Operator: {appointment.operator || 'N/A'}
                                  </p>
                                </>
                              )}

                              {appointment.department === 'accounting' && (
                                <p className="homeUser-top-core-left-date-data-text-light">
                                  Accounting Task: {appointment.accounting_task ? capitalize(appointment.accounting_task) : 'N/A'}
                                </p>
                              )}

                              <p className="homeUser-top-core-left-date-data-text-light">
                                Employee: {appointment.employee || 'N/A'}
                              </p>
                              <p className="homeUser-top-core-left-date-data-text-light">
                                Purpose: {appointment.purpose ? capitalize(appointment.purpose) : 'N/A'}
                              </p>
                            </div>

                            <div className="homeUser-top-core-left-date-data-cards">
                              {['start_time', 'end_time'].map((timeType, idx) => (
                                <div
                                  key={timeType}
                                  className={`homeUser-top-core-left-date-data-cards-${timeType === 'start_time' ? 'start' : 'end'}`}
                                >
                                  <Clock
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      '--stroke-color': 'var(--black-color-opacity-30)',
                                      '--stroke-width': '5px',
                                    }}
                                  />
                                  <div className={`homeUser-top-core-left-date-data-cards-${timeType === 'start_time' ? 'start' : 'end'}-text`}>
                                    <p className={`homeUser-top-core-left-date-data-cards-${timeType === 'start_time' ? 'start' : 'end'}-text-light`}>
                                      {timeType === 'start_time' ? 'Starts at' : 'Ends at'}
                                    </p>
                                    <p className={`homeUser-top-core-left-date-data-cards-${timeType === 'start_time' ? 'start' : 'end'}-text-medium`}>
                                      {formatTime(appointment[timeType])}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="homeUser-top-core-left-date-data-buttons">
                              <button
                                onClick={() => setIsRescheduleModalOpen(true)}
                                className="button-resched"
                              >
                                Reschedule Appointment
                              </button>

                              <button
                                onClick={handleDeleteAppointment}
                                className="red-button-cancel"
                              >
                                Delete Appointment
                              </button>
                            </div>
                          </>
                        ) : (
                          <p style={{ padding: '1rem', fontStyle: 'italic' }}>You have no scheduled appointment yet.</p>
                        )}
                      </div>
                    </div>

                    {!appointment.date && (
                      <div className="homeUser-top-core-left-btn">
                        <button onClick={() => setIsModalOpen(true)} className="homeUser-top-core-left-btn-button">
                          <Book style={{ color: 'var(--white-color)', width: '20px', height: '20px' }} />
                          Set Appointment
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="homeUser-top-core-right">
                <div className="homeUser-top-core-right-header">
                  <header>Certificate upload</header>
                  <Cloud_Upload
                    style={{
                      width: '1.4rem',
                      height: '1.4rem',
                      '--stroke-color': 'var(--black-color-opacity-60)',
                      '--stroke-width': '6px',
                      '--fill-color': 'none',
                    }}
                  />
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
                      <div className="homeUser-top-core-right-form-file">
                        <div className="homeUser-top-core-right-form-file-header">
                          <div className="homeUser-top-core-right-form-file-header-heading">
                            <p className="homeUser-top-core-right-form-file-header-heading-medium">File upload</p>
                            <File_Add
                              style={{
                                width: '1.4rem',
                                height: '1.4rem',
                                '--stroke-color': 'var(--black-color-opacity-60)',
                                '--stroke-width': '6px',
                                '--fill-color': 'none',
                              }}
                            />
                          </div>
                          <p className="homeUser-top-core-right-form-file-header-light">Select the type of certificate</p>
                        </div>

                        <div className="homeUser-top-core-right-form-file-upload">
                          <Cloud_Upload
                            style={{
                              width: '1.6rem',
                              height: '1.6rem',
                              '--stroke-color': 'var(--primary-color)',
                              '--stroke-width': '6px',
                              '--fill-color': 'none',
                            }}
                          />
                          <div className="homeUser-top-core-right-form-file-upload-text">
                            {file ? (
                              <div className="homeUser-top-core-right-form-file-upload-file">
                                <p className="homeUser-top-core-right-form-file-upload-text-bold">{file.name}</p>
                                <svg
                                  onClick={() => setFile(null)}
                                  className="homeUser-top-core-right-form-file-upload-remove"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="var(--black-color-opacity-60)"
                                  strokeWidth="2"
                                  style={{ cursor: 'pointer', marginLeft: '8px' }}
                                >
                                  <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                              </div>
                            ) : (
                              <>
                                <p className="homeUser-top-core-right-form-file-upload-text-bold">Choose a file to upload</p>
                                <p className="homeUser-top-core-right-form-file-upload-text-light"> JPG, PNG and PDF only up to 30 MB</p>
                              </>
                            )}
                          </div>

                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                            style={{ display: 'none' }}
                            id="certificate-upload"
                          />

                          <label htmlFor="certificate-upload" className="homeUser-top-core-right-form-file-upload-btn">
                            <Folder_Open
                              style={{
                                width: '1.4rem',
                                height: '1.4rem',
                                '--stroke-color': 'var(--primary-color-opacity-60)',
                                '--stroke-width': '6px',
                                '--fill-color': 'none',
                              }}
                            />
                            <p style={{ cursor: 'pointer' }}>Browse files</p>
                          </label>
                        </div>
                      </div>

                      <div className="homeUser-top-core-right-form-input">
                        <div className="homeUser-top-core-right-form-input-fields">
                          <div className="homeUser-top-core-right-form-input-fields-select">
                            <select
                              value={certificateType}
                              onChange={(e) => setCertificateType(e.target.value)}
                              required
                            >
                              <option value="" disabled>Select certificate type</option>
                              {certificateTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="homeUser-top-core-right-form-input-fields-text">
                            <input
                              type="text"
                              value={certificateName}
                              onChange={(e) => setCertificateName(e.target.value)}
                              placeholder="Certificate Name"
                              required
                            />
                          </div>

                          <div className="homeUser-top-core-right-form-input-fields-date">
                            <input
                              type="date"
                              value={expirationDate}
                              onChange={(e) => setExpirationDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              required
                            />
                          </div>
                        </div>

                        <button className="homeUser-top-core-right-form-input-btn">
                          <Check
                            style={{
                              width: '24px',
                              height: '40px',
                              '--stroke-color': 'var(--primary-color)',
                              '--stroke-width': '6px',
                              '--fill-color': 'none',
                            }}
                          />
                          <p style={{ cursor: 'pointer' }}>Upload now</p>
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