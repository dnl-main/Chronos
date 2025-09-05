import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { setupTokenTimeout } from '../../../../../app/utils/authTimeout';

const useHomeUserLeftLogic = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const queryClient = useQueryClient();

  const token = useMemo(() => sessionStorage.getItem('token'), []);

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

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: appointmentData,
    isLoading: appointmentLoading,
  } = useQuery({
    queryKey: ['appointment'],
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}/appointment`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const appt = Array.isArray(response.data) ? response.data[0] : response.data;

      if (appt?.status === 'cancelled') {
        return null;
      }
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
    onError: () =>
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
        status: ''
      }),
  });

  useEffect(() => {
    if (appointmentData) {
      setAppointment(appointmentData);
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
        status: ''
      });
    }
  }, [appointmentData]);

  const deleteAppointmentMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`${apiUrl}/appointment/${appointment.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
    },
    onSuccess: () => {
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
        status: ''
      });
      alert('Appointment cancelled successfully');
      queryClient.invalidateQueries(['appointment']);
    },
    onError: (error) =>
      alert(error.response?.data.message || 'Failed to cancel appointment'),
  });

  const handleDeleteAppointment = () => {
    if (!appointment.id) return alert('No appointment to cancel');
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      deleteAppointmentMutation.mutate();
    }
  };

  const rescheduleMutation = useMutation({
    mutationFn: async (rescheduleData) => {
      const response = await axios.patch(
        `${apiUrl}/appointment/${appointment.id}`,
        rescheduleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      alert('Appointment rescheduled successfully');
      setAppointment(data);
      setIsRescheduleModalOpen(false);
      queryClient.invalidateQueries(['appointment']);
    },
    onError: (error) =>
      alert(error.response?.data.message || 'Failed to reschedule appointment'),
  });

  const handleRescheduleAppointment = (rescheduleData) => {
    rescheduleMutation.mutate(rescheduleData);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleAppointmentBooked = (appt) => setAppointment({ ...appt });

  const capitalize = (str) => {
    if (typeof str !== 'string' || !str.trim()) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  

  return {
    appointment,
    appointmentLoading,
    handleDeleteAppointment,
    isModalOpen,
    setIsModalOpen,
    handleRescheduleAppointment,
    isRescheduleModalOpen,
    setIsRescheduleModalOpen,
    formatTime,
    handleAppointmentBooked,
    capitalize,
  };
};

export default useHomeUserLeftLogic;