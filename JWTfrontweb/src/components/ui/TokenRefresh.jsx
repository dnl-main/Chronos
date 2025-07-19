import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ROUTES } from '../../app/router/routes'; // Path to src/app/router/routes.js

// Create AuthContext to share token and refresh function
export const AuthContext = createContext();
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const TokenRefresh = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem('token')); // Use sessionStorage
  const navigate = useNavigate();
  const location = useLocation();

  // Function to refresh token
  const refreshToken = async () => {
    if (!token) {
      console.warn('No token found, redirecting to login');
      navigate(ROUTES.LOGIN);
      return null;
    }

    try {
     
      const response = await axios.post(
            `${apiUrl}/login`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newToken = response.data.token;
      setToken(newToken);
      sessionStorage.setItem('token', newToken); // Use sessionStorage
      console.log('Token refreshed successfully at', new Date().toISOString());
      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error.response?.data?.message || error.message);
      sessionStorage.removeItem('token'); // Use sessionStorage
      setToken(null);
      navigate(ROUTES.LOGIN);
      return null;
    }
  };

  // Debounce function to limit refresh checks
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Check token and refresh on activity
  const checkToken = useCallback(
    debounce(() => {
      const isPublicPath = [
        ROUTES.LANDING,
        ROUTES.LOGIN,
        ROUTES.SIGNUP,
        ROUTES.REGISTRATION,
      ].includes(location.pathname);

      if (!token || isPublicPath) {
        console.debug('Skipping token refresh: No token or on public path', {
          tokenExists: !!token,
          isPublicPath,
          pathname: location.pathname,
        });
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        const expiresIn = decoded.exp - currentTime;

        console.debug('Token check triggered by activity:', {
          expiresInSeconds: expiresIn,
          currentTime: new Date(currentTime * 1000).toISOString(),
          expiresAt: new Date(decoded.exp * 1000).toISOString(),
        });

        if (expiresIn <= 0) {
          console.warn('Token has expired, redirecting to login');
          sessionStorage.removeItem('token'); // Use sessionStorage
          setToken(null);
          navigate(ROUTES.LOGIN);
        } else {
          console.log('User activity detected, refreshing token...');
          refreshToken();
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        sessionStorage.removeItem('token'); // Use sessionStorage
        setToken(null);
        navigate(ROUTES.LOGIN);
      }
    }, 1000), // Debounce for 1 second to prevent rapid calls
    [token, location.pathname, navigate]
  );

  // Set up event listeners for user activity
  useEffect(() => {
    if (!token || [
      ROUTES.LANDING,
      ROUTES.LOGIN,
      ROUTES.SIGNUP,
      ROUTES.REGISTRATION,
    ].includes(location.pathname)) {
      console.debug('No event listeners added: No token or on public path', {
        tokenExists: !!token,
        pathname: location.pathname,
      });
      return;
    }

    // Add event listeners for mouse movement, keypress, click, and scroll
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((event) => {
      window.addEventListener(event, checkToken);
    });

    // Cleanup event listeners
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, checkToken);
      });
    };
  }, [token, location.pathname, checkToken]);

  return (
    <AuthContext.Provider value={{ token, setToken, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default TokenRefresh;