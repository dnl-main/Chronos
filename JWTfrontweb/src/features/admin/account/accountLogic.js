// accountLogic.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useAccountLogic = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  const storageUrl = import.meta.env.VITE_STORAGE_BASE_URL || 'http://127.0.0.1:8000/storage';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('token');
        const storedUser = sessionStorage.getItem('user');

        if (!token) {
          navigate('/login');
          return;
        }

        let userData = storedUser ? JSON.parse(storedUser) : null;

        if (!userData) {
          const response = await axios.get(`${apiUrl}/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
          });
          userData = response.data;
        }

        // Role-based routing
        if (userData.role === 'user') {
          navigate('/user/homeuser');
          return;
        }
        if (userData.role !== 'admin') {
          navigate('/login');
          return;
        }

        const loginResponse = await axios.post(`${apiUrl}/login`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
          withCredentials: true,
        });

        userData.needs_position = loginResponse.data.needs_position;
        sessionStorage.setItem('user', JSON.stringify(userData));

        const profilePictureResponse = await axios.get(`${apiUrl}/user/profile-picture`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });

        setUser({
          ...userData,
          profile_picture: profilePictureResponse.data.path || null,
        });
      } catch (error) {
        console.error('User Fetch Error:', error);
        setError('Failed to load user data.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [apiUrl, navigate]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.post(`${apiUrl}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
    } catch (error) {
      alert('Logout failed: ' + error.message);
    } finally {
      setLoading(false);
      sessionStorage.clear();
      navigate('/login');
    }
  };

  const handleProfilePictureSave = (url) => {
    setUser((prevUser) => ({
      ...prevUser,
      profile_picture: url,
    }));
  };

  return {
    user,
    loading,
    error,
    handleLogout,
    handleProfilePictureSave,
    storageUrl,
  };
};

export const formatPhoneNumber = (raw) => {
  if (!raw) return 'N/A';
  const cleaned = raw.startsWith('0') ? raw.substring(1) : raw;
  return cleaned.length >= 10
    ? `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
    : cleaned;
};
