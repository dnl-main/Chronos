import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Wrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          // Token expired
          console.log('Token expired, clearing localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
          return;
        }

        // Prefer role from storedUser (set by Signup) if available, else use JWT
        let role = decoded?.role;
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          role = parsedUser?.role || role;
        }

        console.log('Wrapper - Decoded Role:', role, 'Path:', location.pathname);

        // Only redirect from /login or /signup if role is valid
        if (location.pathname === '/login' || location.pathname === '/signup') {
          if (role === 'admin') {
            console.log('Redirecting to /admin/home');
            navigate('/admin/home', { replace: true });
          } else if (role === 'user') {
            console.log('Redirecting to /user/homeuser');
            navigate('/user/homeuser', { replace: true });
          } else {
            // Invalid or missing role
            console.log('Invalid role, clearing localStorage');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { replace: true });
          }
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
      }
    } else {
      // No token, redirect to login unless already on public routes
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        console.log('No token, redirecting to /login');
        navigate('/login', { replace: true });
      }
    }
  }, [navigate, location]);

  return children;
};

export default Wrapper;