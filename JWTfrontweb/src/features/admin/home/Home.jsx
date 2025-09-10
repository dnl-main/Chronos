import React, { useReducer, useMemo, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

// Components import
import ScheduleCard from '../schedule/cards/ScheduleCard';
import Spinner from '../../../components/ui/Spinner';
import Appointment from '../components/modals/appointment/manageAppointment/Appointment';
import EditAppointment from '../components/modals/appointment/editAppointment/EditAppointment';
import AvailableCrew from './homeComponents/AvailableCrew';
import TotalCrew from './homeComponents/TotalCrew';
import ComingToday from './homeComponents/ComingToday';
import UpcomingAppointment from './homeComponents/UpcomingAppointment';
import ExpiringCertificates from './homeComponents/ExpiringCertificate';

// CSS import
import './home.css';

// Icon import
import Calendar_Event from '../../../assets/icons/Calendar_Event.svg?react';
import More_Grid_Big from '../../../assets/icons/More_Grid_Big.svg?react';
import Calendar_Check from '../../../assets/icons/Calendar_Check.svg?react';
import Calendar_Week from '../../../assets/icons/Calendar_Week.svg?react';
import Arrow_Right_SM from '../../../assets/icons/Arrow_Right_SM.svg?react';

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
  const queryClient = useQueryClient();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch user data with longer staleTime to reduce calls
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
    staleTime: 1000 * 60 * 30, // 30 minutes - reduce refetches
    cacheTime: 1000 * 60 * 60, // 1 hour - keep in cache longer
    refetchOnWindowFocus: false, // Prevent refetch on focus
    refetchOnMount: false, // Rely on cache and sessionStorage
  });

  // Fetch all dashboard data
  const [todayCountQuery, appointmentsQuery, crewCountsQuery] = useQueries({
    queries: [
      {
        queryKey: ['todayCount'],
        queryFn: async () => {
          const token = sessionStorage.getItem('token');
          const response = await fetch(`${apiUrl}/appointment/today/count`, {
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
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 30, // 30 minutes
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['appointments'],
        queryFn: async () => {
          const token = sessionStorage.getItem('token');
          const response = await fetch(`${apiUrl}/appointment/specific`, {
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
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
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
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
      },
    ],
  });

  // Handle user data and redirects - prioritize sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      try {
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
      } catch (error) {
        // console.error('Failed to parse stored user:', error);
        // Fall through to fetch from API if parsing fails
      }
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
      console.log('Appointments Data:', appointmentsQuery.data); // Debug log
      const appointments = Array.isArray(appointmentsQuery.data) ? appointmentsQuery.data : [];
      const today = format(utcToZonedTime(new Date(), 'America/Los_Angeles'), 'yyyy-MM-dd');
      const normalizeDate = (dateString) => {
        try {
          const date = parseISO(dateString);
          const dateInPST = utcToZonedTime(date, 'America/Los_Angeles');
          return format(dateInPST, 'yyyy-MM-dd');
        } catch (error) {
          console.error('Error parsing date:', dateString, error);
          return null;
        }
      };
      const todayAppointments = appointments
        .filter((app) => normalizeDate(app.date) === today && app.status === 'booked')
        .slice(0, 3);
      console.log('Today Appointments:', todayAppointments); // Debug log
      const pendingAppointments = appointments.filter((app) => app.status === 'pending').slice(0, 3);
      const upcomingAppointments = appointments
        .filter((app) => normalizeDate(app.date) >= today && app.status === 'booked')
        .slice(0, 3);
      dispatch({
        type: 'SET_APPOINTMENTS',
        payload: {
          todayAppointments,
          pendingAppointments,
          upcomingAppointments,
        },
      });
      dispatch({
        type: 'SET_UPCOMING_COUNT',
        payload: appointments.filter((app) => normalizeDate(app.date) >= today && app.status === 'booked').length
      });
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
    if (todayCountQuery.error || appointmentsQuery.error || crewCountsQuery.error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load dashboard data.' });
    }
    dispatch({
      type: 'SET_LOADING',
      payload:
        userLoading ||
        todayCountQuery.isLoading ||
        appointmentsQuery.isLoading ||
        crewCountsQuery.isLoading,
    });
  }, [
    todayCountQuery.data,
    todayCountQuery.error,
    appointmentsQuery.data,
    appointmentsQuery.error,
    crewCountsQuery.data,
    crewCountsQuery.error,
    userLoading,
    todayCountQuery.isLoading,
    appointmentsQuery.isLoading,
    crewCountsQuery.isLoading,
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
    queryClient.invalidateQueries(['appointments']); // Invalidate appointments query
  }, [queryClient]);

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
                <More_Grid_Big
                  style={{ color: 'var(--black-color)', width: '32px', height: '32px', '--stroke-width': '1.5px' }}
                />
                <p>Dashboard</p>
              </div>
              <button
                className="home-top-header-button"
                onClick={() => dispatch({ type: 'SET_MODAL_OPEN', payload: true })}
              >
                <Calendar_Check
                  style={{
                    width: '20px',
                    height: '20px',
                    '--stroke-color': 'var(--white-color)',
                    '--stroke-width': '7px',
                  }}
                />
                <p>Book now</p>
              </button>
              {state.isModalOpen && (
                <Appointment onClose={() => dispatch({ type: 'SET_MODAL_OPEN', payload: false })} />
              )}
            </header>

            <main className="home-top-main">
              <section className="home-top-main-left">
                <AvailableCrew
                  availableCrewCount={state.availableCrewCount}
                  jobTitleItems={jobTitleItems}
                />
                <TotalCrew totalCrewCount={state.totalCrewCount} />
              </section>

              <section className="home-top-main-mid">
                <ComingToday
                  todayCount={state.todayCount}
                  todayAppointments={state.todayAppointments}
                  onRedirect={handleRedirectToday}
                />
                <UpcomingAppointment
                  upcomingCount={state.upcomingCount}
                  nearestAppointment={nearestAppointment}
                  onRedirect={handleRedirectUpcoming}
                />
              </section>

              <ExpiringCertificates />
            </main>
          </div>

          <div className="home-bot">
            <header className="home-bot-header">
              <Calendar_Week
                style={{
                  width: '24px',
                  height: '24px',
                  '--stroke-width': '2px',
                  '--stroke-color': 'var(--black-color)',
                }}
              />
              <p>Coming today</p>
              <button onClick={handleRedirectToday}>
                <Arrow_Right_SM
                  style={{ color: 'var(--black-color)', width: '24px', height: '24px', '--stroke-width': '5' }}
                />
              </button>
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
                  width: '24px',
                  height: '24px',
                  '--stroke-width': '2px',
                  '--stroke-color': 'var(--black-color)',
                }}
              />
              <p>Pending</p>
              <button onClick={handleRedirectPending}>
                <Arrow_Right_SM
                  style={{ color: 'var(--black-color)', width: '24px', height: '24px', '--stroke-width': '5' }}
                />
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