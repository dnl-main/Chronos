import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ROUTES } from './routes';
import Spinner from '../../components/ui/Spinner';

// Eager load Landing (fast access)
import Landing from '../landing/Landing';

// Lazy public pages
const Signup = lazy(() => import('../landing/onboarding/signup/Signup'));
const Registration = lazy(() => import('../landing/onboarding/register/Registration'));
const Login = lazy(() => import('../landing/onboarding/login/Login'));

// Lazy load the protected route tree
const ProtectedRoutes = lazy(() => import('./ProtectedRoutes'));

const AppRoutes = () => {
  const location = useLocation();

  const isPublicPath = [
    ROUTES.LANDING,
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.REGISTRATION,
  ].includes(location.pathname);

  return (
    <Routes>
      {isPublicPath ? (
        <>
          <Route path={ROUTES.LANDING} element={<Landing />} />
          <Route path={ROUTES.LOGIN} element={<Suspense fallback={<Spinner />}><Login /></Suspense>} />
          <Route path={ROUTES.SIGNUP} element={<Suspense fallback={<Spinner />}><Signup /></Suspense>} />
          <Route path={ROUTES.REGISTRATION} element={<Suspense fallback={<Spinner />}><Registration /></Suspense>} />
        </>
      ) : (
        <Route
          path="/*"
          element={
            <Suspense fallback={<Spinner />}>
              <ProtectedRoutes />
            </Suspense>
          }
        />
      )}
    </Routes>
  );
};

export default AppRoutes;
