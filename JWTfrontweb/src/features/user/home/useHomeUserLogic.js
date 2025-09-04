import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { setupTokenTimeout } from '../../../app/utils/authTimeout';

const useHomeUserLogic = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const queryClient = useQueryClient();
  const token = useMemo(() => sessionStorage.getItem('token'), []);
  const storedUser = useMemo(() => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }, []);

  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [appointment, setAppointment] = useState({
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
    status: ''
  });


  const statusOptions = ['On Board', 'Available', 'Vacation'];

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      navigate('/login');
      return;
    }

    setupTokenTimeout(token, storedUser, navigate);
  }, [token, storedUser, navigate]);

  const {
    data: user,
    isLoading: loadingUser,
    isError: errorUser,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
      if (response.data.role !== 'user') navigate('/login');
      sessionStorage.setItem('user', JSON.stringify(response.data));
      setSelectedStatus(response.data.availability || 'Available');
      return response.data;
    },
    enabled: !!token,
    onError: () => navigate('/login'),
  });

  const {
    data: appointmentData,
    isLoading: appointmentLoading,
  } = useQuery({
    queryKey: ['appointment'],
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}/appointment`, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
      const appt = Array.isArray(response.data) ? response.data[0] : response.data;
      return {
        id: appt?.id || null,
        date: appt?.date || '',
        start_time: appt?.start_time || '',
        end_time: appt?.end_time || '',
        department: appt?.department || '',
        crewing_dept: appt?.crewing_dept || '',
        operator: appt?.operator || '',
        accounting_task: appt?.accounting_task || '',
        employee: appt?.employee || '',
        purpose: appt?.purpose || '',
        status: appt?.status || '',
      };
    },
    enabled: !!token,
    onError: () => setAppointment({
id: null, date: '', start_time: '', end_time: '', department: '', crewing_dept: '',
      operator: '', accounting_task: '', employee: '', purpose: '', status: ''
    }),
  });

  useEffect(() => {
    if (appointmentData) {
      if (user?.role !== 'admin' && appointmentData.status === 'completed') {
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
          status: '',
        });
      } else {
        setAppointment(appointmentData);
      }
    }
  }, [appointmentData, user]);
  

  const statusMutation = useMutation({
    mutationFn: async (newStatus) => {
      const response = await axios.patch(
        `${apiUrl}/user/availability`,
        { availability: newStatus },
        { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } }
      );
      return response.data.user;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Status updated successfully');
    },
    onError: (error) => alert(error.response?.data.message || 'Failed to update status'),
  });

  useEffect(() => {
    if (user && selectedStatus && selectedStatus !== user.availability) {
      statusMutation.mutate(selectedStatus);
    }
  }, [selectedStatus, user]);

  const handleStatusChange = (e) => setSelectedStatus(e.target.value);

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/logout`, {}, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } });
    } catch {}
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const handleAppointmentBooked = () => {
    queryClient.invalidateQueries(['appointment']);
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const deleteAppointmentMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`${apiUrl}/appointment/${appointment.id}`, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
    },
    onSuccess: () => {
      setAppointment({
 id: null, date: '', start_time: '', end_time: '', department: '', crewing_dept: '',
        operator: '', accounting_task: '', employee: '', purpose: '', status: ''
      });
      alert('Appointment deleted successfully');
      queryClient.invalidateQueries(['appointment']);
    },
    onError: (error) => alert(error.response?.data.message || 'Failed to delete appointment'),
  });

  const handleDeleteAppointment = () => {
    if (!appointment.id) return alert('No appointment to delete');
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointmentMutation.mutate();
    }
  };

  const handleRescheduleAppointment = (rescheduleData) => {
    rescheduleMutation.mutate(rescheduleData);
  };

  return {
    user,
    loadingUser,
    errorUser,
    appointment,
    appointmentLoading,
    selectedStatus,
    statusOptions,
    handleStatusChange,
    handleLogout,
    formatTime,
    handleAppointmentBooked,
    capitalize,
    isModalOpen,
    setIsModalOpen,
    isRescheduleModalOpen,
    setIsRescheduleModalOpen,
    handleDeleteAppointment,
    handleRescheduleAppointment,
  };
};

export default useHomeUserLogic;