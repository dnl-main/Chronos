import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './calendar.css';
import { Navbar } from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';

const Calendar = () => {
    const [overlayContent, setOverlayContent] = useState(null);
    const navigate = useNavigate(); 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
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
        setUser(parsedUser);
        setLoading(false);
      } else {
        fetchUserData(token);
      }
    }, [navigate]);
    
    const fetchUserData = async (token) => {
      try {
        const response = await axios.get(`${apiUrl}/user`, {
          headers: { Authorization: `Bearer ${token}` },
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
    
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
//BLOCK TO
    if (loading) {
      return null; 
    }
     
  return (
    <div className="calendar">
          <Navbar />
          <Sidebar />
      <h1>Calendar</h1>
    </div>
  );
};

export default Calendar;
