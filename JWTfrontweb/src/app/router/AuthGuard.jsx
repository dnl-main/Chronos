// src/router/AuthGuard.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Spinner from '../../components/ui/Spinner';
import { ROUTES } from './routes';

const AuthGuard = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const forceLogout = () => {
    sessionStorage.clear();
    navigate(ROUTES.LOGIN, { replace: true });
    setIsLoading(false);
  };

  const validateToken = () => {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    // Only allow public routes without token
    if (!token) {
      if (![ROUTES.LOGIN, ROUTES.SIGNUP, ROUTES.REGISTRATION, ROUTES.LANDING].includes(location.pathname)) {
        navigate(ROUTES.LOGIN, { replace: true });
      }
      return setIsLoading(false);
    }

    try {
      const decoded = jwtDecode(token);
      const expired = decoded.exp && decoded.exp < Date.now() / 1000;
      if (expired) return forceLogout();

      const role = user?.role || decoded?.role;
      const region = user?.region || decoded?.region;

      // Role-based redirection and restriction
      if (role === 'user') {
        if (!region || region.trim() === '') return forceLogout();
        if (location.pathname === ROUTES.USER_ROOT) {
          navigate(ROUTES.USER_HOME, { replace: true });
        }
        if (location.pathname.startsWith(ROUTES.ADMIN_ROOT) || location.pathname.startsWith(ROUTES.SUPERADMIN_ROOT)) {
          navigate(ROUTES.USER_HOME, { replace: true });
        }
      }

      if (role === 'admin') {
        if (location.pathname === ROUTES.ADMIN_ROOT) {
          navigate(ROUTES.ADMIN_HOME, { replace: true });
        }
        if (!location.pathname.startsWith(ROUTES.ADMIN_ROOT)) {
          navigate(ROUTES.ADMIN_HOME, { replace: true });
        }
      }

      if (role === 'superadmin') {
        if (location.pathname === ROUTES.SUPERADMIN_ROOT) {
          navigate(ROUTES.SUPERADMIN_HOME, { replace: true });
        }
        if (!location.pathname.startsWith(ROUTES.SUPERADMIN_ROOT)) {
          navigate(ROUTES.SUPERADMIN_HOME, { replace: true });
        }
      }

    } catch (err) {
      return forceLogout();
    }

    setIsLoading(false);
  };

  useEffect(() => {
    validateToken();
    const interval = setInterval(validateToken, 10000); // revalidate token every 10 seconds
    return () => clearInterval(interval);
  }, [location.pathname]);

  return isLoading ? <Spinner /> : children;
};

export default AuthGuard;
