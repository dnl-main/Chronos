import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Spinner from './Spinner.jsx';

const Wrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const checkToken = () => {
    console.log('Checking token for path:', location.pathname);
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    if (!token) {
      console.log('No token found, redirecting to /login');
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/login', { replace: true });
      }
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        console.log('Token expired in Wrapper, exp:', decoded.exp, 'currentTime:', currentTime);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login', { replace: true });
        setIsLoading(false);
        return;
      }

      // Prefer role and region from storedUser if available, else use JWT
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

      console.log('User data:', { role, region, path: location.pathname });

      // Robust region check
      const hasRegion = region && typeof region === 'string' && region.trim() !== '';

      // Security checks
      if (role === 'user') {
        if (location.pathname === '/registration' && !hasRegion) {
          console.log('New user on /registration without region, clearing sessionStorage and redirecting to /login');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          navigate('/login', { replace: true });
          setIsLoading(false);
          return;
        }

        if (location.pathname === '/user' || location.pathname === '/user/') {
          console.log('User accessing /user, redirecting to:', hasRegion ? '/user/homeuser' : '/login');
          if (!hasRegion) {
            console.log('User has no region, clearing sessionStorage');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
          }
          navigate(hasRegion ? '/user/homeuser' : '/login', { replace: true });
          setIsLoading(false);
          return;
        }

        if (location.pathname.startsWith('/user/') && !hasRegion) {
          console.log('User has no region, redirecting to /login and clearing sessionStorage');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          navigate('/login', { replace: true });
          setIsLoading(false);
          return;
        }

        if (location.pathname.startsWith('/admin/')) {
          console.log('User trying to access admin routes, redirecting');
          if (!hasRegion) {
            console.log('User has no region, clearing sessionStorage');
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
          console.log('Admin accessing /admin, redirecting to /admin/home');
          navigate('/admin/home', { replace: true });
          setIsLoading(false);
          return;
        }

        if (location.pathname.startsWith('/user/')) {
          console.log('Admin trying to access user routes, redirecting to /admin/home');
          navigate('/admin/home', { replace: true });
          setIsLoading(false);
          return;
        }
      } else {
        console.log('Invalid role, clearing sessionStorage');
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
    console.log('Wrapper is loading, preventing render for path:', location.pathname);
    return <Spinner />;
  }

  console.log('Wrapper rendering children for path:', location.pathname);
  return children;
};

export default Wrapper;