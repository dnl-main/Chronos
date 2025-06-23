// src/utils/authTimeout.js
import { jwtDecode } from 'jwt-decode';
import { ROUTES } from '../router/routes';

export const setupTokenTimeout = (navigate) => {
  const token = sessionStorage.getItem('token');
  const user = sessionStorage.getItem('user');

  if (!token || !user) {
    sessionStorage.clear();
    navigate(ROUTES.LOGIN, { replace: true });
    return null;
  }

  try {
    const { exp } = jwtDecode(token);
    const timeLeft = exp * 1000 - Date.now();

    if (timeLeft <= 0) {
      sessionStorage.clear();
      navigate(ROUTES.LOGIN, { replace: true });
      return null;
    }

    return setTimeout(() => {
      sessionStorage.clear();
      navigate(ROUTES.LOGIN, { replace: true });
    }, timeLeft);

  } catch (err) {
    sessionStorage.clear();
    navigate(ROUTES.LOGIN, { replace: true });
    return null;
  }
};
