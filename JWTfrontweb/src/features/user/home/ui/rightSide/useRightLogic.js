import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useRightLogic = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const token = useMemo(() => sessionStorage.getItem('token'), []);

  const [appointments, setAppointments] = useState([]);

  const {
    data: appointmentData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['appointmentHistory'],
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}/appointments/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      return Array.isArray(response.data) ? response.data : response.data.data || [];
    },
    enabled: !!token,
    // --- CHANGE: React Query refetches automatically when invalidated
    refetchOnWindowFocus: false,
    staleTime: 0, // --- CHANGE: ensures it always refetches after invalidation
    onError: (err) => {
      console.error('Error fetching appointment history:', err);
    },
  });

  // keep local state in sync
  useEffect(() => {
    setAppointments(appointmentData || []);
  }, [appointmentData]);

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

  const capitalize = (str) => {
    if (typeof str !== 'string' || !str.trim()) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const errorMessage = error
    ? error.response?.data?.message || 'Failed to fetch appointment history'
    : null;

  return {
    appointments,
    loading,
    error: errorMessage,
    formatTime,
    capitalize,
  };
};

export default useRightLogic;
