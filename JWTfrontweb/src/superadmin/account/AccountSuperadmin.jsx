import './accountSuperadmin.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarSuperadmin from '../navbar/NavbarSuperadmin';
import SidebarSuperadmin from '../sidebar/SidebarSuperadmin';
import More_Grid_Big from '../../assets/icons/More_Grid_Big.svg?react';
import Spinner from '../../components/Spinner';

const AccountSuperadmin = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('token');
        const storedUser = sessionStorage.getItem('user');

        // Redirect to login if no token
        if (!token) {
          navigate('/login');
          return;
        }

        // Check and parse stored user
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role === 'user') {
              navigate('/user/homeuser');
              return;
            }
            if (parsedUser.role === 'admin') {
              navigate('/admin/homeadmin');
              return;
            }
            if (parsedUser.role !== 'superadmin') {
              navigate('/login');
              return;
            }
          } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login');
            return;
          }
        } else {
          // Fetch user data if not stored
          const response = await axios.get(`${apiUrl}/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
          });
          const fetchedUserData = response.data;

          if (fetchedUserData.role === 'user') {
            navigate('/user/homeuser');
            return;
          }
          if (fetchedUserData.role === 'admin') {
            navigate('/admin/homeadmin');
            return;
          }
          if (fetchedUserData.role !== 'superadmin') {
            navigate('/login');
            return;
          }
          sessionStorage.setItem('user', JSON.stringify(fetchedUserData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
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
      await axios.post(
        `${apiUrl}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
    } catch (error) {
      alert('Logout failed: ' + error.message);
    } finally {
      setLoading(false);
      sessionStorage.clear();
      navigate('/login');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="account">
      <NavbarSuperadmin />
      <SidebarSuperadmin />
      <div className="account-box">
        <div className="account-box-in">
          <main className="account-box-in-card">
            <header className="account-box-in-card-header">
              <div className="account-box-in-card-header-left">
                <More_Grid_Big
                  style={{
                    color: 'var(--black-color)',
                    width: '32px',
                    height: '32px',
                    '--stroke-width': '1.5px',
                  }}
                />
                <p>Account</p>
              </div>
              <button
                className="account-box-in-card-header-btn"
                onClick={handleLogout}
                disabled={loading}
              >
                <p>Logout</p>
              </button>
            </header>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountSuperadmin;