import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Wrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return;
        }

        const role = decoded?.role;

        if (location.pathname === '/login' || location.pathname === '/signup') {
          if (role === 'admin') {
            navigate('/user/home', { replace: true });
          } else {
            navigate('/user/homeuser', { replace: true });
          }
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate, location]);

  return children;
};

export default Wrapper;
