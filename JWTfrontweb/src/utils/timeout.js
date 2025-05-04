import { jwtDecode } from 'jwt-decode';

export const handleAuthToken = (token, user, navigate) => {
  if (!token || !user) {
    console.log('No token or user, redirecting to /login');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login', { replace: true });
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    const exp = decoded.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const timeLeft = exp - now;

    if (timeLeft <= 0) {
      console.log('Token expired, redirecting to /login', { exp, now });
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/login', { replace: true });
      return false;
    }

    console.log('Token valid, scheduling logout in', timeLeft, 'ms');
    const timeoutId = setTimeout(() => {
      console.log('Token timeout triggered, redirecting to /login');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/login', { replace: true });
    }, timeLeft);

    return timeoutId; // Return timeout ID for cleanup
  } catch (err) {
    console.error('Token decoding failed:', err);
    console.log('Redirecting to /login due to invalid token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login', { replace: true });
    return false;
  }
};