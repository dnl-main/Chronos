import React, { useReducer, useMemo, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueries, useQuery } from '@tanstack/react-query';

// Components import
import ScheduleCard from '../schedule/cards/ScheduleCard';
import Spinner from '../../../components/ui/Spinner';
import Appointment from '../components/modals/appointment/manageAppointment/Appointment';
import EditAppointment from '../components/modals/appointment/editAppointment/EditAppointment';
import HomeCertAdmin from './ui/ExpiringCertificates';

// CSS import
import './home.css';

// Icon import
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

// Reducer for state management
const initialState = {
  isModalOpen: false,
  isEditModalOpen: false,
  selectedAppointmentData: null,
  user: null,
  loading: true,
  error: null,
  todayCount: 0,
  upcomingCount: 0,
  todayAppointments: [],
  pendingAppointments: [],
  upcomingAppointments: [],
  availableCrewCount: 0,
  totalCrewCount: 0,
  jobTitleCounts: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_MODAL_OPEN':
      return { ...state, isModalOpen: action.payload };
    case 'SET_EDIT_MODAL_OPEN':
      return { ...state, isEditModalOpen: action.payload };
    case 'SET_SELECTED_APPOINTMENT':
      return { ...state, selectedAppointmentData: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_TODAY_COUNT':
      return { ...state, todayCount: action.payload };
    case 'SET_UPCOMING_COUNT':
      return { ...state, upcomingCount: action.payload };
    case 'SET_APPOINTMENTS':
      return {
        ...state,
        todayAppointments: action.payload.todayAppointments,
        pendingAppointments: action.payload.pendingAppointments,
        upcomingAppointments: action.payload.upcomingAppointments,
      };
    case 'SET_CREW_COUNTS':
      return {
        ...state,
        availableCrewCount: action.payload.availableCrewCount,
        totalCrewCount: action.payload.totalCrewCount,
        jobTitleCounts: action.payload.jobTitleCounts,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const Home = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch user data with useQuery
  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const response = await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    enabled: !!sessionStorage.getItem('token'), 
    staleTime: 1000 * 60 * 5, 
  });

  // Parallel queries for dashboard data
  const [todayCountQuery, appointmentsQuery, upcomingAppointmentsQuery, crewCountsQuery] = useQueries({
    queries: [
      {
        queryKey: ['todayCount'],
        queryFn: async () => {
          const token = sessionStorage.getItem('token');
          const response = await fetch(`${apiUrl}/appointment/today/count?_limit=3`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
            credentials: 'include',
          });
          if (!response.ok) throw new Error('Failed to fetch today count');
          return response.json();
        },
        enabled: !!state.user, 
        staleTime: 1000 * 60, 
      },
      {
        queryKey: ['appointments'],
        queryFn: async () => {
          const token = sessionStorage.getItem('token');
          const response = await fetch(`${apiUrl}/appointment/specific?_limit=3`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
            credentials: 'include',
          });
          if (!response.ok) throw new Error('Failed to fetch appointments');
          return response.json();
        },
        enabled: !!state.user,
        staleTime: 1000 * 60,
      },
      {
        queryKey: ['upcomingAppointments'],
        queryFn: async () => {
          const token = sessionStorage.getItem('token');
          const response = await fetch(`${apiUrl}/appointment/upcoming/specific?_limit=3`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
            credentials: 'include',
          });
          if (!response.ok) throw new Error('Failed to fetch upcoming appointments');
          return response.json();
        },
        enabled: !!state.user,
        staleTime: 1000 * 60,
      },
      {
        queryKey: ['crewCounts'],
        queryFn: async () => {
          const token = sessionStorage.getItem('token');
          const response = await fetch(`${apiUrl}/appointment/crew-counts`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
            credentials: 'include',
          });
          if (!response.ok) throw new Error('Failed to fetch crew counts');
          return response.json();
        },
        enabled: !!state.user,
        staleTime: 1000 * 60,
      },
    ],
  });

  // Handle user data and redirects
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
      dispatch({ type: 'SET_USER', payload: parsedUser });
      dispatch({ type: 'SET_LOADING', payload: false });
    } else if (userData) {
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
      dispatch({ type: 'SET_USER', payload: userData });
      sessionStorage.setItem('user', JSON.stringify(userData));
      dispatch({ type: 'SET_LOADING', payload: false });
    }

    if (userError) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data. Please log in again.' });
      navigate('/login');
    }
  }, [userData, userError, navigate]);

  // Update state with query results
  useEffect(() => {
    if (todayCountQuery.data) {
      dispatch({ type: 'SET_TODAY_COUNT', payload: todayCountQuery.data.count || 0 });
    }
    if (appointmentsQuery.data) {
      const appointments = Array.isArray(appointmentsQuery.data) ? appointmentsQuery.data : [];
      dispatch({
        type: 'SET_APPOINTMENTS',
        payload: {
          todayAppointments: appointments.filter(
            (app) => app.computed_status === 'today' && app.status !== 'pending' && app.status !== 'completed'
          ),
          pendingAppointments: appointments.filter((app) => app.status === 'pending'),
          upcomingAppointments: [],
        },
      });
    }
    if (upcomingAppointmentsQuery.data) {
      const upcoming = Array.isArray(upcomingAppointmentsQuery.data)
        ? upcomingAppointmentsQuery.data.filter((app) => app.status !== 'completed')
        : [];
      dispatch({
        type: 'SET_APPOINTMENTS',
        payload: {
          todayAppointments: state.todayAppointments,
          pendingAppointments: state.pendingAppointments,
          upcomingAppointments: upcoming,
        },
      });
      dispatch({ type: 'SET_UPCOMING_COUNT', payload: upcoming.length });
    }
    if (crewCountsQuery.data) {
      dispatch({
        type: 'SET_CREW_COUNTS',
        payload: {
          availableCrewCount: crewCountsQuery.data.available_crew_count || 0,
          totalCrewCount: crewCountsQuery.data.total_crew_count || 0,
          jobTitleCounts: crewCountsQuery.data.job_title_counts || {},
        },
      });
    }
    if (todayCountQuery.error || appointmentsQuery.error || upcomingAppointmentsQuery.error || crewCountsQuery.error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load dashboard data.' });
    }
    dispatch({ type: 'SET_LOADING', payload: userLoading || todayCountQuery.isLoading || appointmentsQuery.isLoading || upcomingAppointmentsQuery.isLoading || crewCountsQuery.isLoading });
  }, [
    todayCountQuery.data,
    todayCountQuery.error,
    appointmentsQuery.data,
    appointmentsQuery.error,
    upcomingAppointmentsQuery.data,
    upcomingAppointmentsQuery.error,
    crewCountsQuery.data,
    crewCountsQuery.error,
    userLoading,
    todayCountQuery.isLoading,
    appointmentsQuery.isLoading,
    upcomingAppointmentsQuery.isLoading,
    crewCountsQuery.isLoading,
    state.todayAppointments,
    state.pendingAppointments,
  ]);

  // Memoized event handlers
  const handleRedirectToday = useCallback(() => {
    navigate('/admin/schedule?tab=today');
  }, [navigate]);

  const handleRedirectUpcoming = useCallback(() => {
    navigate('/admin/schedule?tab=upcoming');
  }, [navigate]);

  const handleRedirectPending = useCallback(() => {
    navigate('/admin/schedule?tab=pending');
  }, [navigate]);

  const handleEditClick = useCallback(
    ({ appointment, user, bookedAppointments }) => {
      dispatch({ type: 'SET_SELECTED_APPOINTMENT', payload: { appointment, user, bookedAppointments } });
      dispatch({ type: 'SET_EDIT_MODAL_OPEN', payload: true });
    },
    []
  );

  const handleEditModalClose = useCallback(() => {
    dispatch({ type: 'SET_EDIT_MODAL_OPEN', payload: false });
    dispatch({ type: 'SET_SELECTED_APPOINTMENT', payload: null });
    const token = sessionStorage.getItem('token');
    if (token) {

    }
  }, []);

  // Memoized derived data
  const nearestAppointment = useMemo(() => {
    if (state.upcomingAppointments.length === 0) return null;
    const today = new Date();
    return state.upcomingAppointments.reduce((nearest, app) => {
      const appDate = new Date(app.date);
      const nearestDate = nearest ? new Date(nearest.date) : null;
      if (!nearest || Math.abs(appDate - today) < Math.abs(nearestDate - today)) {
        return app;
      }
      return nearest;
    }, null);
  }, [state.upcomingAppointments]);

  // Memoized job title counts for rendering
  const jobTitleItems = useMemo(() => {
    const items = Object.entries(state.jobTitleCounts).map(([title, count]) => ({
      title,
      count,
    }));
    if (items.length === 0) {
      return [{ title: 'No available job titles', count: 0 }];
    }
    return [...items, { title: 'More', count: 0 }];
  }, [state.jobTitleCounts]);

  if (state.loading) {
    return <Spinner />;
  }

  if (state.error) {
    return <div className="home-error">{state.error}</div>;
  }

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
                onClick={() => dispatch({ type: 'SET_MODAL_OPEN', payload: true })}
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
              {state.isModalOpen && <Appointment onClose={() => dispatch({ type: 'SET_MODAL_OPEN', payload: false })} />}
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
                      <p>{state.availableCrewCount}</p>
                    </div>
                    <div className="home-top-main-left-up-data-complete"></div>
                  </div>
                  <div className="home-top-main-left-up-job">
                    <header className="home-top-main-left-up-job-header">
                      <p>Job title</p>
                    </header>
                    <main className="home-top-main-left-up-job-main">
                      {jobTitleItems.map(({ title, count }) => (
                        <div key={title} className="home-top-main-left-up-job-main-card">
                          <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                          <p>{title}</p>
                          {count > 0 && <p>({count})</p>}
                        </div>
                      ))}
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
                      <p>{state.totalCrewCount}</p>
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
                    <p>{state.todayCount}</p>
                  </div>
                  <div className="home-top-main-mid-up-time">
                    <p className="home-top-main-mid-up-time-sub">Arrival time</p>
                    <p className="home-top-main-mid-up-time-main">
                      {state.todayAppointments.length > 0
                        ? new Date(`1970-01-01T${state.todayAppointments[0].start_time}`).toLocaleString('en-US', {
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
                    <p>{state.upcomingCount}</p>
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
              {state.todayAppointments.length > 0 ? (
                state.todayAppointments.slice(0, 3).map((app) => (
                  <ScheduleCard
                    key={app.id}
                    appointment={app}
                    user={app.user}
                    allAppointments={state.todayAppointments}
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
              {state.pendingAppointments.length > 0 ? (
                state.pendingAppointments.slice(0, 3).map((app) => (
                  <ScheduleCard
                    key={app.id}
                    appointment={app}
                    user={app.user}
                    allAppointments={state.pendingAppointments}
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

      {state.isEditModalOpen && state.selectedAppointmentData && (
        <EditAppointment
          appointment={state.selectedAppointmentData.appointment}
          user={state.selectedAppointmentData.user}
          bookedAppointments={state.selectedAppointmentData.bookedAppointments}
          onClose={handleEditModalClose}
        />
      )}
    </div>
  );
};

export default Home;