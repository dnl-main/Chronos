import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Spinner from './Spinner.jsx';

const Wrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const checkToken = () => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    if (!token) {
      // Allow /login, /signup, and /reset-password without a token
      if (
        location.pathname !== '/login' &&
        location.pathname !== '/signup' &&
        location.pathname !== '/reset-password'
      ) {
        navigate('/login', { replace: true });
      }
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login', { replace: true });
        setIsLoading(false);
        return;
      }

      let role = decoded?.role;
      let region = decoded?.region;
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          role = parsedUser?.role || role;
          region = parsedUser?.region || region;
        } catch (err) {
          console.error('Error parsing stored user:', err);
        }
      }

      // Region check
      const hasRegion = region && typeof region === 'string' && region.trim() !== '';

      // Security checks
      if (role === 'user') {
        if (location.pathname === '/registration' && !hasRegion) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          navigate('/login', { replace: true });
          setIsLoading(false);
          return;
        }

        if (location.pathname === '/user' || location.pathname === '/user/') {
          if (!hasRegion) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
          }
          navigate(hasRegion ? '/user/homeuser' : '/login', { replace: true });
          setIsLoading(false);
          return;
        }

        if (location.pathname.startsWith('/user/') && !hasRegion) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          navigate('/login', { replace: true });
          setIsLoading(false);
          return;
        }

        if (location.pathname.startsWith('/admin/')) {
          if (!hasRegion) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            navigate('/login', { replace: true });
          } else {
            navigate('/user/homeuser', { replace: true });
          }
          setIsLoading(false);
          return;
        }
      } else if (role === 'admin') {
        if (location.pathname === '/admin' || location.pathname === '/admin/') {
          navigate('/admin/home', { replace: true });
          setIsLoading(false);
          return;
        }

        if (location.pathname.startsWith('/user/')) {
          navigate('/admin/home', { replace: true });
          setIsLoading(false);
          return;
        }
      } else {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login', { replace: true });
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error decoding token:', err);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/login', { replace: true });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
    const intervalId = setInterval(checkToken, 10000); // Check every 10 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [navigate, location]);

  if (isLoading) {
    return <Spinner />;
  }

  return children;
};

export default Wrapper;