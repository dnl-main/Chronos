import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Account = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        const loginResponse = await axios.post(`${apiUrl}/login`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
          withCredentials: true,
        });

        userData.needs_position = loginResponse.data.needs_position;

        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Fetch Error:', error.message);
        setError('Failed to load user data.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [apiUrl, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>User Data</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default Account;
 