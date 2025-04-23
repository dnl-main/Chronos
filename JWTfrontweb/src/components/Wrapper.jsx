import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Wrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true); // Prevent rendering until checks complete

  useEffect(() => {
    console.log('Wrapper useEffect running for path:', location.pathname);

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

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
        console.log('Token expired, clearing localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
        // For new users without region, clear token and redirect to /login on /registration
        if (location.pathname === '/registration' && !hasRegion) {
          console.log('New user on /registration without region, clearing localStorage and redirecting to /login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
          setIsLoading(false);
          return;
        }

        // Block user routes if no region
        if (location.pathname.startsWith('/user/') && !hasRegion) {
          console.log('User has no region, redirecting to /login and clearing localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
          setIsLoading(false);
          return;
        }

        // Block admin routes for users
        if (location.pathname.startsWith('/admin/')) {
          console.log('User trying to access admin routes, redirecting');
          if (!hasRegion) {
            console.log('User has no region, clearing localStorage');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { replace: true });
          } else {
            navigate('/user/homeuser', { replace: true });
          }
          setIsLoading(false);
          return;
        }
      } else if (role === 'admin') {
        // Block user routes for admins
        if (location.pathname.startsWith('/user/')) {
          console.log('Admin trying to access user routes, redirecting to /admin/home');
          navigate('/admin/home', { replace: true });
          setIsLoading(false);
          return;
        }
      } else {
        // Invalid or missing role
        console.log('Invalid role, clearing localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        setIsLoading(false);
        return;
      }

      // Redirect from auth pages
      if (location.pathname === '/login' || location.pathname === '/signup') {
        if (role === 'admin') {
          console.log('Admin on auth page, redirecting to /admin/home');
          navigate('/admin/home', { replace: true });
        } else if (role === 'user') {
          console.log('User on auth page, redirecting to:', hasRegion ? '/user/homeuser' : '/login');
          if (!hasRegion) {
            console.log('User has no region, clearing localStorage');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          navigate(hasRegion ? '/user/homeuser' : '/login', { replace: true });
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error decoding token:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
      setIsLoading(false);
    }
  }, [navigate, location]);

  if (isLoading) {
    console.log('Wrapper is loading, preventing render for path:', location.pathname);
    return <div>Loading...</div>;
  }

  console.log('Wrapper rendering children for path:', location.pathname);
  return children;
};

export default Wrapper;