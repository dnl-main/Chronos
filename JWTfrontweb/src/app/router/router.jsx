import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ROUTES } from './routes';
import Spinner from '../../components/ui/Spinner';
// Adjusted path for authTimeout.js
import { setupTokenTimeout } from '../utils/authTimeout.js';

// Lazy public pages
const Landing = lazy(() => import('../landing/Landing'));
const Signup = lazy(() => import('../landing/onboarding/signup/Signup'));
const Registration = lazy(() => import('../landing/onboarding/register/Registration'));
const Login = lazy(() => import('../landing/onboarding/login/Login'));

// Lazy load the protected route tree
const ProtectedRoutes = lazy(() => import('./ProtectedRoutes'));

const AppRoutes = () => {
    // const isPublicPath = [
  //   ROUTES.LANDING,
  //   ROUTES.LOGIN,
  //   ROUTES.SIGNUP,
  //   ROUTES.REGISTRATION,
  // ].includes(location.pathname);
  const navigate = useNavigate();

  // Set up token timeout and cleanup
  useEffect(() => {
    const cleanup = setupTokenTimeout(navigate);
    return cleanup; // Cleanup on unmount
  }, [navigate]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LANDING} element={<Suspense fallback={<Spinner />}><Landing /></Suspense>} />
      <Route path={ROUTES.LOGIN} element={<Suspense fallback={<Spinner />}><Login /></Suspense>} />
      <Route path={ROUTES.SIGNUP} element={<Suspense fallback={<Spinner />}><Signup /></Suspense>} />
      <Route path={ROUTES.REGISTRATION} element={<Suspense fallback={<Spinner />}><Registration /></Suspense>} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <Suspense fallback={<Spinner />}>
            <ProtectedRoutes />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default AppRoutes;