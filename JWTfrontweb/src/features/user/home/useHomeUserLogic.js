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

  const statusOptions = ['On Board', 'Available', 'Vacation'];
  const hasRun = useRef(false);

  // Authentication & Token Timeout
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      navigate('/login');
      return;
    }

    setupTokenTimeout(token, storedUser, navigate);
  }, [token, storedUser, navigate]);

  // Fetch user data
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

  // Update user availability status
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

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post(
        `${apiUrl}/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } }
      );
    } catch {}
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  // Utility functions
  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return {
    user,
    loadingUser,
    errorUser,
    selectedStatus,
    statusOptions,
    handleStatusChange,
    handleLogout,
    formatTime,
    capitalize,
    isModalOpen,
    setIsModalOpen,
    isRescheduleModalOpen,
    setIsRescheduleModalOpen,
  };
};

export default useHomeUserLogic;
