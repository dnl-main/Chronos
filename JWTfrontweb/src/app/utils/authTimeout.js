import axios from 'axios';

import { jwtDecode } from 'jwt-decode';
import { ROUTES } from '../router/routes';


// Simple debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Main function to manage token timeout and refresh
export const setupTokenTimeout = (navigate) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  let timeoutId = null;
  let clickListener = null;

  // Validate navigate is a function
  if (typeof navigate !== 'function') {
    console.error('navigate is not a function, received:', navigate);
    return () => {};
  }

  // Function to clear existing timeout and click listener
  const clearExistingHandlers = () => {
    if (timeoutId) {
      console.debug('Clearing existing token timeout');
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (clickListener) {
      console.debug('Removing click listener');
      window.removeEventListener('click', clickListener);
      clickListener = null;
    }
  };

  // Function to refresh token
  const refreshToken = async (token) => {
    if (!token) {
      console.warn('No token found, redirecting to login');
      clearExistingHandlers();
      sessionStorage.clear();
      navigate(ROUTES.LOGIN, { replace: true });
      return false;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newToken = response.data.token;
      sessionStorage.setItem('token', newToken);
      console.log('Token refreshed successfully at', new Date().toISOString());
      clearExistingHandlers();
      checkToken(); // Re-run check to set up new handlers
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error.response?.data?.message || error.message);
      clearExistingHandlers();
      sessionStorage.clear();
      navigate(ROUTES.LOGIN, { replace: true });
      return false;
    }
  };

  // Handle click events to reset token expiration when within 5 minutes
  const handleUserActivity = debounce(() => {
    const token = sessionStorage.getItem('token');
    const isPublicPath = [
      ROUTES.LANDING,
      ROUTES.LOGIN,
      ROUTES.SIGNUP,
      ROUTES.REGISTRATION,
    ].includes(window.location.pathname);

    if (!token || isPublicPath) {
      console.debug('Skipping token refresh: No token or on public path', {
        tokenExists: !!token,
        isPublicPath,
        pathname: window.location.pathname,
      });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const expiresIn = decoded.exp - currentTime;

      console.debug('Click event detected:', {
        expiresInSeconds: expiresIn,
        currentTime: new Date(currentTime * 1000).toISOString(),
        expiresAt: new Date(decoded.exp * 1000).toISOString(),
      });

      if (expiresIn > 0 && expiresIn <= 300) {
        console.log('Token nearing expiration, refreshing due to click event...');
        refreshToken(token);
      } else if (expiresIn <= 0) {
        console.warn('Token has expired, redirecting to login');
        clearExistingHandlers();
        sessionStorage.clear();
        navigate(ROUTES.LOGIN, { replace: true });
      } else {
        console.debug('Token has more than 5 minutes remaining, no refresh needed');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      clearExistingHandlers();
      sessionStorage.clear();
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, 10000); // Debounce for 10 seconds

  // Main logic to check token and set up handlers
  const checkToken = () => {
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');
    const isPublicPath = [
      ROUTES.LANDING,
      ROUTES.LOGIN,
      ROUTES.SIGNUP,
      ROUTES.REGISTRATION,
    ].includes(window.location.pathname);

    if (!token || !user || isPublicPath) {
      console.debug('Skipping token check: No token, no user, or on public path');
      if (!token || !user) {
        clearExistingHandlers();
        sessionStorage.clear();
        navigate(ROUTES.LOGIN, { replace: true });
      }
      return;
    }

    try {
      const { exp } = jwtDecode(token);
      const timeLeft = exp * 1000 - Date.now();

      if (timeLeft <= 0) {
        console.warn('Token has expired, redirecting to login');
        clearExistingHandlers();
        sessionStorage.clear();
        navigate(ROUTES.LOGIN, { replace: true });
        return;
      }

      if (timeLeft <= 300000) { // 300,000 ms = 5 minutes
        console.debug('Token within 5 minutes of expiration, enabling click listener');
        if (!clickListener) {
          clickListener = handleUserActivity;
          window.addEventListener('click', clickListener);
        }
      } else {
        console.debug('Token has more than 5 minutes remaining, disabling click listener');
        if (clickListener) {
          window.removeEventListener('click', clickListener);
          clickListener = null;
        }
      }
    } catch (err) {
      console.error('Error decoding token in checkToken:', err);
      clearExistingHandlers();
      sessionStorage.clear();
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  // Initial check
  checkToken();

  // Periodic check every 1 minute
  const intervalId = setInterval(checkToken, 60000);

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    clearExistingHandlers();
  };
};