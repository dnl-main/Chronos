import React, { useReducer, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import axios from 'axios';

// Components import
import ScheduleCard from './cards/ScheduleCard';
import Spinner from '../../../components/ui/Spinner';
import EditAppointment from '../components/modals/appointment/editAppointment/EditAppointment';

// CSS import
import './schedule.css';

// Icon import
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import Calendar_Event from '../../../assets/icons/Calendar_Event.svg?react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Reducer for state management
const initialState = {
  appointments: [],
  loading: true,
  error: null,
  selectedTab: 'all',
  isModalOpen: false,
  modalData: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SELECTED_TAB':
      return { ...state, selectedTab: action.payload };
    case 'SET_IS_MODAL_OPEN':
      return { ...state, isModalOpen: action.payload };
    case 'SET_MODAL_DATA':
      return { ...state, modalData: action.payload };
    default:
      return state;
  }
};

const Schedule = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { appointments, loading, error, selectedTab, isModalOpen, modalData } = state;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentRef = useRef(null);

  // Handle tab change from search params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (['today', 'upcoming', 'all', 'pending', 'completed', 'cancelled'].includes(tabParam)) {
      dispatch({ type: 'SET_SELECTED_TAB', payload: tabParam });
    }
  }, [searchParams]);

  // Normalize date to YYYY-MM-DD format
  const normalizeDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }, []);

  // Sort appointments by date
  const sortAppointmentsByDate = useCallback((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }, []);

  // Filtered appointment data for each tab
  const today = new Date().toISOString().split('T')[0];
  const filteredAppointmentsToday = appointments
    .filter((app) => normalizeDate(app.date) === today && app.status === 'booked')
    .sort(sortAppointmentsByDate);
  const filteredAppointmentsUpcoming = appointments
    .filter((app) => normalizeDate(app.date) > today && app.status !== 'completed' && app.status !== 'pending' && app.status !== 'cancelled')
    .sort(sortAppointmentsByDate);
  const filteredAppointmentsPending = appointments
    .filter((app) => app.status === 'pending' && normalizeDate(app.date) >= today)
    .sort(sortAppointmentsByDate);
  const filteredAppointmentsCompleted = appointments
    .filter((app) => app.status === 'completed')
    .sort(sortAppointmentsByDate);
  const filteredAppointmentsCancelled = appointments
    .filter((app) => app.status === 'cancelled')
    .sort(sortAppointmentsByDate);

  // Virtualization setup for each tab
  const todayVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count: filteredAppointmentsToday.length,
    estimateSize: () => 174,
    overscan: 20,
    paddingStart: 20,
    paddingEnd: 20,
  });

  const upcomingVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count: filteredAppointmentsUpcoming.length,
    estimateSize: () => 174,
    overscan: 20,
    paddingStart: 20,
    paddingEnd: 20,
  });

  const pendingVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count: filteredAppointmentsPending.length,
    estimateSize: () => 174,
    overscan: 20,
    paddingStart: 20,
    paddingEnd: 20,
  });

  const completedVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count: filteredAppointmentsCompleted.length,
    estimateSize: () => 174,
    overscan: 20,
    paddingStart: 20,
    paddingEnd: 20,
  });

  const cancelledVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count: filteredAppointmentsCancelled.length,
    estimateSize: () => 174,
    overscan: 20,
    paddingStart: 20,
    paddingEnd: 20,
  });

  // Memoized callback functions
  const handleEditClick = useCallback((data) => {
    dispatch({ type: 'SET_MODAL_DATA', payload: data });
    dispatch({ type: 'SET_IS_MODAL_OPEN', payload: true });
  }, []);

  const handleCloseModal = useCallback(() => {
    dispatch({ type: 'SET_IS_MODAL_OPEN', payload: false });
    dispatch({ type: 'SET_MODAL_DATA', payload: null });
    // Refresh appointments after modal closes
    const token = sessionStorage.getItem('token');
    if (token) {
      axios
        .get(`${apiUrl}/appointment/specific`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
          withCredentials: true,
        })
        .then((response) => {
          dispatch({
            type: 'SET_APPOINTMENTS',
            payload: Array.isArray(response.data) ? response.data : [response.data].filter(Boolean),
          });
        })
        .catch((error) => {
          dispatch({
            type: 'SET_ERROR',
            payload: error.response?.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to load appointments.',
          });
          if (error.response?.status === 401) {
            navigate('/login');
          }
        });
    }
  }, [navigate]);

  const handleTabChange = useCallback((tab) => {
    dispatch({ type: 'SET_SELECTED_TAB', payload: tab });
  }, []);

  // TanStack Query for fetching user data
  const { data: userData, isLoading: isUserLoading, isError: isUserError, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!sessionStorage.getItem('token'),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  // TanStack Query for fetching appointments
  const { data: appointmentsData, isLoading: isAppointmentsLoading, isError: isAppointmentsError, error: appointmentsError } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${apiUrl}/appointment/specific`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });
      return Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
    },
    enabled: !!userData && userData.role === 'admin',
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  // Handle authentication and data fetching
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const storedUser = sessionStorage.getItem('user');
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
      } catch (error) {
        console.error('Parse User Error:', error);
        navigate('/login');
        return;
      }
    }

    if (userData) {
      if (userData.role === 'user') {
        navigate('/user/homeuser');
        return;
      }
      if (userData.role !== 'admin') {
        navigate('/login');
        return;
      }
      sessionStorage.setItem('user', JSON.stringify(userData));
    }

    if (appointmentsData) {
      dispatch({ type: 'SET_APPOINTMENTS', payload: appointmentsData });
    }

    if (isUserError) {
      console.error('Fetch User Error:', userError.message);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data. Please log in again.' });
      navigate('/login');
    }

    if (isAppointmentsError) {
      console.error('Fetch Appointments Error:', appointmentsError.message);
      dispatch({
        type: 'SET_ERROR',
        payload: appointmentsError.response?.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to load appointments.',
      });
      if (appointmentsError.response?.status === 401) {
        navigate('/login');
      }
    }

    dispatch({ type: 'SET_LOADING', payload: isUserLoading || isAppointmentsLoading });
  }, [navigate, userData, isUserLoading, isUserError, userError, appointmentsData, isAppointmentsLoading, isAppointmentsError, appointmentsError]);

  if (loading) return <Spinner />;
  if (error) return <div className="schedule-error">{error}</div>;

  return (
    <div className="schedule">
      <div className="schedule-box">
        <main className="schedule-box-in" style={{ rowGap: selectedTab === 'all' ? '0' : '6vh' }}>
          <header className="schedule-header">
            <Calendar_Event
              style={{
                color: 'var(--black-color)',
                width: '32px',
                height: '32px',
                '--stroke-width': '4px',
              }}
            />
            <p>Scheduled appointments</p>
          </header>

          <section className="schedule-tabs">
            {['all', 'today', 'upcoming', 'pending', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                className={`schedule-tabs-${tab} ${selectedTab === tab ? 'schedule-tab-active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                <Circle_Primary
                  style={{
                    width: '20px',
                    height: '20px',
                  }}
                />
                <p>{tab.charAt(0).toUpperCase() + tab.slice(1)}</p>
              </button>
            ))}
          </section>

          {(selectedTab === 'today' || selectedTab === 'all') && (
            <>
              <header className="schedule-header-today">
                <p>Today</p>
              </header>
              <section className="schedule-today" ref={parentRef} style={{ overflow: 'auto', paddingTop: selectedTab === 'all' ? '0' : '20px', minHeight: '500px' }}>
                <div style={{ height: `${todayVirtualizer.getTotalSize()}px`, width: '100%' }}>
                  {todayVirtualizer.getVirtualItems().map((virtualRow) => (
                    <div
                      key={virtualRow.index}
                      style={{
                        height: `${virtualRow.size}px`,
                        width: '100%',
                      }}
                    >
                      <ScheduleCard
                        appointment={filteredAppointmentsToday[virtualRow.index]}
                        user={filteredAppointmentsToday[virtualRow.index].user}
                        allAppointments={appointments}
                        onEditClick={handleEditClick}
                      />
                    </div>
                  ))}
                </div>
                {filteredAppointmentsToday.length === 0 && (
                  <p style={{ color: '#888', padding: '1rem' }}>No appointments today.</p>
                )}
              </section>
            </>
          )}

          {(selectedTab === 'upcoming' || selectedTab === 'all') && (
            <>
              <header className="schedule-header-today" style={{ marginTop: selectedTab === 'all' ? '0' : '20px' }}>
                <p>Upcoming</p>
              </header>
              <section className="schedule-today" ref={parentRef} style={{ overflow: 'auto', paddingTop: selectedTab === 'all' ? '0' : '20px', minHeight: '500px' }}>
                <div style={{ height: `${upcomingVirtualizer.getTotalSize()}px`, width: '100%' }}>
                  {upcomingVirtualizer.getVirtualItems().map((virtualRow) => (
                    <div
                      key={virtualRow.index}
                      style={{
                        height: `${virtualRow.size}px`,
                        width: '100%',
                      }}
                    >
                      <ScheduleCard
                        appointment={filteredAppointmentsUpcoming[virtualRow.index]}
                        user={filteredAppointmentsUpcoming[virtualRow.index].user}
                        allAppointments={appointments}
                        onEditClick={handleEditClick}
                      />
                    </div>
                  ))}
                </div>
                {filteredAppointmentsUpcoming.length === 0 && (
                  <p style={{ color: '#888', padding: '1rem' }}>No upcoming appointments.</p>
                )}
              </section>
            </>
          )}

          {(selectedTab === 'pending' || selectedTab === 'all') && (
            <>
              <header className="schedule-header-today" style={{ marginTop: selectedTab === 'all' ? '0' : '20px' }}>
                <p>Pending</p>
              </header>
              <section className="schedule-today" ref={parentRef} style={{ overflow: 'auto', paddingTop: selectedTab === 'all' ? '0' : '20px', minHeight: '500px' }}>
                <div style={{ height: `${pendingVirtualizer.getTotalSize()}px`, width: '100%' }}>
                  {pendingVirtualizer.getVirtualItems().map((virtualRow) => (
                    <div
                      key={virtualRow.index}
                      style={{
                        height: `${virtualRow.size}px`,
                        width: '100%',
                      }}
                    >
                      <ScheduleCard
                        appointment={filteredAppointmentsPending[virtualRow.index]}
                        user={filteredAppointmentsPending[virtualRow.index].user}
                        allAppointments={appointments}
                        onEditClick={handleEditClick}
                      />
                    </div>
                  ))}
                </div>
                {filteredAppointmentsPending.length === 0 && (
                  <p style={{ color: '#888', padding: '1rem' }}>No pending appointments.</p>
                )}
              </section>
            </>
          )}

          {(selectedTab === 'completed' || selectedTab === 'all') && (
            <>
              <header className="schedule-header-completed" style={{ marginTop: selectedTab === 'all' ? '0' : '20px' }}>
                <p>Completed</p>
              </header>
              <section className="schedule-today" ref={parentRef} style={{ overflow: 'auto', paddingTop: selectedTab === 'all' ? '0' : '20px', minHeight: '500px' }}>
                <div style={{ height: `${completedVirtualizer.getTotalSize()}px`, width: '100%' }}>
                  {completedVirtualizer.getVirtualItems().map((virtualRow) => (
                    <div
                      key={virtualRow.index}
                      style={{
                        height: `${virtualRow.size}px`,
                        width: '100%',
                      }}
                    >
                      <ScheduleCard
                        appointment={filteredAppointmentsCompleted[virtualRow.index]}
                        user={filteredAppointmentsCompleted[virtualRow.index].user}
                        allAppointments={appointments}
                        onEditClick={handleEditClick}
                      />
                    </div>
                  ))}
                </div>
                {filteredAppointmentsCompleted.length === 0 && (
                  <p style={{ color: '#888', padding: '1rem' }}>No completed appointments.</p>
                )}
              </section>
            </>
          )}

          {(selectedTab === 'cancelled' || selectedTab === 'all') && (
            <>
              <header className="schedule-header-today" style={{ marginTop: selectedTab === 'all' ? '0' : '20px' }}>
                <p>Cancelled</p>
              </header>
              <section className="schedule-today" ref={parentRef} style={{ overflow: 'auto', paddingTop: selectedTab === 'all' ? '0' : '20px', minHeight: '500px' }}>
                <div style={{ height: `${cancelledVirtualizer.getTotalSize()}px`, width: '100%' }}>
                  {cancelledVirtualizer.getVirtualItems().map((virtualRow) => (
                    <div
                      key={virtualRow.index}
                      style={{
                        height: `${virtualRow.size}px`,
                        width: '100%',
                      }}
                    >
                      <ScheduleCard
                        appointment={filteredAppointmentsCancelled[virtualRow.index]}
                        user={filteredAppointmentsCancelled[virtualRow.index].user}
                        allAppointments={appointments}
                        onEditClick={handleEditClick}
                      />
                    </div>
                  ))}
                </div>
                {filteredAppointmentsCancelled.length === 0 && (
                  <p style={{ color: '#888', padding: '1rem' }}>No cancelled appointments.</p>
                )}
              </section>
            </>
          )}
        </main>
      </div>

      {isModalOpen && modalData && (
        <div
          className="modal-overlay"
          style={{
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
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '80%',
              maxHeight: '80%',
              overflowY: 'auto',
            }}
          >
            <EditAppointment
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