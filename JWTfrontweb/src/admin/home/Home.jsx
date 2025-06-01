import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './home.css';

import { Navbar } from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import ScheduleCard from '../schedule/scheduleComponents/ScheduleCard';
import Spinner from '../../components/Spinner';
import Appointment from '../appointment/bookAppointment/Appointment';
import ManageAppointment from '../appointment/ManageAppointment'; // Import ManageAppointment
import HomeCertAdmin from './HomeCertAdmin';

import Calendar_Event from '../../assets/icons/Calendar_Event.svg?react';
import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Arrow_Right_SM from '../../assets/icons/Arrow_Right_SM.svg?react';
import Users from '../../assets/icons/Users.svg?react';
import Notebook from '../../assets/icons/Notebook.svg?react';
import Book from '../../assets/icons/Book.svg?react';
import Calendar_Week from '../../assets/icons/Calendar_Week.svg?react';
import User_Add from '../../assets/icons/User_Add.svg?react';
import More_Grid_Big from '../../assets/icons/More_Grid_Big.svg?react';
import Calendar_Check from '../../assets/icons/Calendar_Check.svg?react';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // New state for edit modal
  const [selectedAppointmentData, setSelectedAppointmentData] = useState(null); // State for edit appointment data
  const [overlayContent, setOverlayContent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [availableCrewCount, setAvailableCrewCount] = useState(0);
  const [totalCrewCount, setTotalCrewCount] = useState(0);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [jobTitleCounts, setJobTitleCounts] = useState({});
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

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
      if (!parsedUser.position || !parsedUser.department) {
        alert('Please add your Job title and Department to continue');
        navigate('/admin/account');
        return;
      }
      setUser(parsedUser);
      fetchAllUsers(token);
      fetchDashboardData(token);
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
      if (userData.role === 'user') {
        navigate('/user/homeuser');
        return;
      }
      if (userData.role !== 'admin') {
        navigate('/login');
        return;
      }
      if (!userData.position || !userData.department) {
        alert('Please add your Job title and Department to continue');
        navigate('/admin/account');
        return;
      }

      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
      fetchAllUsers(token);
      await fetchDashboardData(token);
    } catch (error) {
      setError('Failed to load user data. Please log in again.');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (token) => {
    try {
      setError(null);
      const todayCountResponse = await axios.get(`${apiUrl}/appointment/today/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      setTodayCount(todayCountResponse.data.count);

      const upcomingCountResponse = await axios.get(`${apiUrl}/appointment/upcoming/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      setUpcomingCount(upcomingCountResponse.data.count);

      const appointmentsResponse = await axios.get(`${apiUrl}/appointment`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      const appointments = Array.isArray(appointmentsResponse.data) ? appointmentsResponse.data : [];
      setTodayAppointments(appointments.filter((app) => app.computed_status === 'today'));

      const upcomingAppointmentsResponse = await axios.get(`${apiUrl}/appointment/upcoming`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      const upcoming = Array.isArray(upcomingAppointmentsResponse.data)
        ? upcomingAppointmentsResponse.data
        : [];
      setUpcomingAppointments(upcoming);
    } catch (error) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/crew-members`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      setAllUsers(response.data);
      calculateJobTitleCounts(response.data);
      const availableCount = response.data.filter(
        (user) => user.availability && user.availability.toLowerCase() === 'available'
      ).length;
      setAvailableCrewCount(availableCount);
      const userCount = response.data.filter((user) => user.region != null && user.region !== '').length;
      setTotalCrewCount(userCount);
    } catch (error) {
      console.error('Failed to fetch all users:', error);
    }
  };

  const calculateJobTitleCounts = (users) => {
    const counts = {};
    users.forEach((user) => {
      if (user.availability && user.availability.toLowerCase() === 'available' && user.position) {
        counts[user.position] = (counts[user.position] || 0) + 1;
      }
    });
    setJobTitleCounts(counts);
  };

  const handleRedirectToday = () => {
    navigate('/admin/schedule?tab=today');
  };

  const handleRedirectUpcoming = () => {
    navigate('/admin/schedule?tab=upcoming');
  };

  const getNearestAppointment = () => {
    if (upcomingAppointments.length === 0) return null;
    const today = new Date();
    return upcomingAppointments.reduce((nearest, app) => {
      const appDate = new Date(app.date);
      const nearestDate = nearest ? new Date(nearest.date) : null;
      if (!nearest || Math.abs(appDate - today) < Math.abs(nearestDate - today)) {
        return app;
      }
      return nearest;
    }, null);
  };

  // Handle edit click from ScheduleCard
  const handleEditClick = ({ appointment, user, bookedAppointments }) => {
    setSelectedAppointmentData({ appointment, user, bookedAppointments });
    setIsEditModalOpen(true);
  };

  // Handle closing the edit modal and refreshing appointments
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedAppointmentData(null);
    // Refresh appointments after closing
    const token = sessionStorage.getItem('token');
    if (token) {
      fetchDashboardData(token);
    }
  };

  useEffect(() => {
    calculateJobTitleCounts(allUsers);
  }, [allUsers]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="home-error">{error}</div>;
  }

  const nearestAppointment = getNearestAppointment();

  return (
    <div className="home">
      <div className="home-box">
        <main className="home-box-in">
          <div className="home-top">
            <header className="home-top-header">
              <div className="home-top-header-heading">
                <More_Grid_Big style={{ color: "var(--black-color)", width: "32px", height: "32px", "--stroke-width": "1.5px" }} />
                <p>Dashboard</p>
              </div>
              <button
                className="home-top-header-button"
                onClick={() => setIsModalOpen(true)}
              >
                <Calendar_Check
                  style={{
                    width: "20px",
                    height: "20px",
                    '--stroke-color': 'var(--white-color)',
                    '--stroke-width': '7px',
                  }}
                />
                <p>Book now</p>
              </button>
              {isModalOpen && <Appointment onClose={() => setIsModalOpen(false)} />}
            </header>

            <main className="home-top-main">
              <section className="home-top-main-left">
                <main className="home-top-main-left-up">
                  <div className="home-top-main-left-up-header">
                    <div className="home-top-main-left-up-header-main">
                      <header>Available crew</header>
                      <Users style={{ color: "var(--black-color)", width: "20px", height: "20px" }} />
                    </div>
                    <Link to="/admin/availability">
                      <button className="home-top-main-left-up-header-btn">
                        <Arrow_Right_SM style={{ color: "var(--black-color)", width: "24px", height: "24px", '--stroke-width': '5' }} />
                      </button>
                    </Link>
                  </div>
                  <div className="home-top-main-left-up-data">
                    <div className="home-top-main-left-up-data-all">
                      <p>{availableCrewCount}</p>
                    </div>
                    <div className="home-top-main-left-up-data-complete"></div>
                  </div>
                  <div className="home-top-main-left-up-job">
                    <header className="home-top-main-left-up-job-header">
                      <p>Job title</p>
                    </header>
                    <main className="home-top-main-left-up-job-main">
                      {Object.entries(jobTitleCounts).map(([title, count]) => (
                        <div key={title} className="home-top-main-left-up-job-main-card">
                          <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                          <p>{title}</p>
                          <p>({count})</p>
                        </div>
                      ))}
                      {Object.keys(jobTitleCounts).length === 0 && (
                        <div className="home-top-main-left-up-job-main-card">
                          <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                          <p>No available job titles</p>
                        </div>
                      )}
                      <div className="home-top-main-left-up-job-main-card">
                        <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                        <p>More</p>
                      </div>
                    </main>
                  </div>
                </main>
                <main className="home-top-main-left-down">
                  <div className="home-top-main-left-down-header">
                    <div className="home-top-main-left-down-header-main">
                      <header>Total Crew</header>
                      <User_Add style={{ color: "var(--primary-color)", width: "20px", height: "20px", '--stroke-width': '7px' }} />
                    </div>
                    <Link to="/admin/availability">
                      <button className="home-top-main-left-down-header-btn">
                        <Arrow_Right_SM style={{ color: "var(--black-color)", width: "24px", height: "24px", '--stroke-width': '5' }} />
                      </button>
                    </Link>
                  </div>
                  <div className="home-top-main-left-down-data">
                    <div className="home-top-main-left-down-data-all">
                      <p>{totalCrewCount}</p>
                    </div>
                    <div className="home-top-main-left-down-data-complete"></div>
                  </div>
                </main>
              </section>

              <section className="home-top-main-mid">
                <main className="home-top-main-mid-up">
                  <div className="home-top-main-mid-up-header">
                    <div className="home-top-main-mid-up-header-main">
                      <header>Coming today</header>
                      <Calendar_Event style={{ color: "var(--black-color)", width: "20px", height: "20px", '--stroke-width': '6px' }} />
                    </div>
                    <button onClick={handleRedirectToday}>
                      <Arrow_Right_SM style={{ color: "var(--black-color)", width: "24px", height: "24px", '--stroke-width': '5' }} />
                    </button>
                  </div>
                  <div className="home-top-main-mid-up-data">
                    <p>{todayCount}</p>
                  </div>
                  <div className="home-top-main-mid-up-time">
                    <p className="home-top-main-mid-up-time-sub">Arrival time</p>
                    <p className="home-top-main-mid-up-time-main">
                      {todayAppointments.length > 0
                        ? new Date(`1970-01-01T${todayAppointments[0].start_time}`).toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </main>
                <main className="home-top-main-mid-down">
                  <div className="home-top-main-mid-down-header">
                    <div className="home-top-main-mid-down-header-main">
                      <header>Upcoming appointment</header>
                      <Book
                        style={{
                          color: "var(--black-color)",
                          width: "20px",
                          height: "20px",
                          '--stroke-width': '4',
                        }}
                      />
                    </div>
                    <button
                      className="home-top-main-left-down-header-btn"
                      onClick={handleRedirectUpcoming}
                    >
                      <Arrow_Right_SM style={{ color: "var(--black-color)", width: "24px", height: "24px", '--stroke-width': '5' }} />
                    </button>
                  </div>
                  <div className="home-top-main-mid-down-data">
                    <p>{upcomingCount}</p>
                  </div>
                  <div className="home-top-main-mid-down-time">
                    <p className="home-top-main-mid-down-time-sub">Arrival date</p>
                    <p className="home-top-main-mid-down-time-main">
                      {nearestAppointment
                        ? new Date(nearestAppointment.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </main>
              </section>

              <section className="home-top-main-right">
                <div className="home-top-main-right-header">
                  <div className="home-top-main-right-header-main">
                    <header>Expiring Certificates</header>
                    <Notebook style={{ color: "var(--black-color)", width: "20px", height: "20px" }} />
                  </div>
                  <Link to="/admin/certificate">
                    <button className="home-top-main-right-header-btn">
                      <Arrow_Right_SM style={{ color: "var(--black-color)", width: "24px", height: "24px", '--stroke-width': '5' }} />
                    </button>
                  </Link>
                </div>
                <HomeCertAdmin />
              </section>
            </main>
          </div>

          <div className="home-bot">
            <header className="home-bot-header">
              <Calendar_Week
                style={{
                  width: "24px",
                  height: "24px",
                  '--stroke-width': '2px',
                  '--stroke-color': 'var(--black-color)',
                }}
              />
              <p>Coming today</p>
            </header>
            <div className="home-bot-cards">
              {todayAppointments.length > 0 ? (
                todayAppointments.slice(0, 3).map((app) => (
                  <ScheduleCard
                    key={app.id}
                    appointment={app}
                    user={app.user}
                    allAppointments={todayAppointments}
                    onEditClick={handleEditClick} // Pass the edit handler
                  />
                ))
              ) : (
                <p>No appointments today.</p>
              )}
            </div>
          </div>
        </main>
      </div>

      {isEditModalOpen && selectedAppointmentData && (
        <ManageAppointment
          appointment={selectedAppointmentData.appointment}
          user={selectedAppointmentData.user}
          bookedAppointments={selectedAppointmentData.bookedAppointments}
          onClose={handleEditModalClose}
        />
      )}
    </div>
  );
};

export default Home;