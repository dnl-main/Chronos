//Dependencies import
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

//Components import
import ScheduleCard from '../schedule/cards/ScheduleCard';
import Spinner from '../../../components/ui/Spinner';
import Appointment from '../components/modals/appointment/manageAppointment/Appointment';
import EditAppointment from '../components/modals/appointment/editAppointment/EditAppointment'
import HomeCertAdmin from './ui/ExpiringCertificates';

//CSS import
import './home.css';

//Icon import 
import Calendar_Event from '../../../assets/icons/Calendar_Event.svg?react';
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import Arrow_Right_SM from '../../../assets/icons/Arrow_Right_SM.svg?react';
import Users from '../../../assets/icons/Users.svg?react';
import Notebook from '../../../assets/icons/Notebook.svg?react';
import Book from '../../../assets/icons/Book.svg?react';
import Calendar_Week from '../../../assets/icons/Calendar_Week.svg?react';
import User_Add from '../../../assets/icons/User_Add.svg?react';
import More_Grid_Big from '../../../assets/icons/More_Grid_Big.svg?react';
import Calendar_Check from '../../../assets/icons/Calendar_Check.svg?react';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointmentData, setSelectedAppointmentData] = useState(null);
  const [overlayContent, setOverlayContent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [availableCrewCount, setAvailableCrewCount] = useState(0);
  const [totalCrewCount, setTotalCrewCount] = useState(0);
  const [error, setError] = useState(null);
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

      const appointmentsResponse = await axios.get(`${apiUrl}/appointment/specific`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      const appointments = Array.isArray(appointmentsResponse.data) ? appointmentsResponse.data : [];
      setTodayAppointments(
        appointments.filter((app) => app.computed_status === 'today' && app.status !== 'pending')
      );
      setPendingAppointments(appointments.filter((app) => app.status === 'pending'));

      const upcomingAppointmentsResponse = await axios.get(`${apiUrl}/appointment/upcoming/specific`, {
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
      const response = await axios.get(`${apiUrl}/appointment/crew-counts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      setAvailableCrewCount(response.data.available_crew_count);
      setTotalCrewCount(response.data.total_crew_count);
      setJobTitleCounts(response.data.job_title_counts);
    } catch (error) {
      // CHANGE: Improved error handling to update error state
      console.error('Failed to fetch crew counts:', error);
      setError('Failed to load crew counts.');
    }
  };

  const handleRedirectToday = () => {
    navigate('/admin/schedule?tab=today');
  };

  const handleRedirectUpcoming = () => {
    navigate('/admin/schedule?tab=upcoming');
  };

  const handleRedirectPending = () => {
    navigate('/admin/schedule?tab=pending');
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

  const handleEditClick = ({ appointment, user, bookedAppointments }) => {
    setSelectedAppointmentData({ appointment, user, bookedAppointments });
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedAppointmentData(null);
    const token = sessionStorage.getItem('token');
    if (token) {
      fetchDashboardData(token);
    }
  };



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
                    onEditClick={handleEditClick}
                  />
                ))
              ) : (
                <p>No appointments today.</p>
              )}
            </div>

            <header className="home-bot-header">
              <Calendar_Week
                style={{
                  width: "24px",
                  height: "24px",
                  '--stroke-width': '2px',
                  '--stroke-color': 'var(--black-color)',
                }}
              />
              <p>Pending</p>
              <button onClick={handleRedirectPending}>
                <Arrow_Right_SM style={{ color: "var(--black-color)", width: "24px", height: "24px", '--stroke-width': '5' }} />
              </button>
            </header>
            <div className="home-bot-cards">
              {pendingAppointments.length > 0 ? (
                pendingAppointments.slice(0, 3).map((app) => (
                  <ScheduleCard
                    key={app.id}
                    appointment={app}
                    user={app.user}
                    allAppointments={pendingAppointments}
                    onEditClick={handleEditClick}
                  />
                ))
              ) : (
                <p>No pending appointments.</p>
              )}
            </div>
          </div>
        </main>
      </div>

      {isEditModalOpen && selectedAppointmentData && (
        <EditAppointment
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