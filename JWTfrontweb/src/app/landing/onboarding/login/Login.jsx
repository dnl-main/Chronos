import React, { useReducer, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';

import { ROUTES } from '../../../router/routes';
import ForgotPassword from './modals/forgotPassword/ForgotPassword';
import Hide from '../../../../assets/icons/Hide.svg?react';
import Show from '../../../../assets/icons/Show.svg?react';
import Spinner from '../../../../components/ui/Spinner';

import login_sailor from '../../../../assets/photo/login_sailor.png';

axios.defaults.withCredentials = true;

const initialState = {
  email: '',
  password: '',
  showPassword: false,
  rememberMe: false,
  hasPreFilled: false,
  error: '',
  loginLoading: false,
  forgotLoading: false,
  showForgotPasswordModal: false,
  forgotEmail: '',
  forgotError: '',
  forgotSuccess: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'TOGGLE':
      return { ...state, [action.field]: !state[action.field] };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_FORGOT_ERROR':
      return { ...state, forgotError: action.payload };
    case 'SET_FORGOT_SUCCESS':
      return { ...state, forgotSuccess: action.payload };
    case 'SET_LOADING':
      return { ...state, loginLoading: action.payload };
    case 'SET_FORGOT_LOADING':
      return { ...state, forgotLoading: action.payload };
    case 'SET_REMEMBER_ME':
      return { ...state, rememberMe: action.payload };
    case 'SET_HAS_PREFILLED':
      return { ...state, hasPreFilled: action.payload };
    default:
      return state;
  }
}

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    email,
    password,
    showPassword,
    rememberMe,
    hasPreFilled,
    error,
    loginLoading,
    forgotLoading,
    showForgotPasswordModal,
    forgotEmail,
    forgotError,
    forgotSuccess,
  } = state;

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail && !hasPreFilled) {
      dispatch({ type: 'SET_FIELD', field: 'email', value: savedEmail });
      dispatch({ type: 'SET_REMEMBER_ME', payload: true });
      dispatch({ type: 'SET_HAS_PREFILLED', payload: true });
    }
  }, [hasPreFilled]);

const handleLogin = async (e) => {
  e.preventDefault();
  sessionStorage.clear();
  dispatch({ type: 'SET_ERROR', payload: '' });
  dispatch({ type: 'SET_LOADING', payload: true });

  try {
    const response = await axios.post(
      `${apiUrl}/login`,
      { email, password },
      { headers: { 'ngrok-skip-browser-warning': 'true' } }
    );

    if (response.data.status && response.data.token) {
      if (email.endsWith('@friendmar.com.ph')) {
        response.data.user.role = 'admin';
      }

      const user = response.data.user;

      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('needs_position', JSON.stringify(response.data.needs_position));

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      }

      if (user.role === 'superadmin') {
        navigate('/superadmin/homesuperadmin');
      } else if (user.role === 'admin') {
        if (!user.position || !user.department) {
          navigate('/admin/account');
          return;
        }
        navigate('/admin/home');
      } else if (user.region) {
        navigate('/user/homeUser');
      } else {
        navigate('/registration');
      }
    } else {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid credentials or incomplete response.' });
      alert('Invalid credentials. Please check your email and password and try again.');
    }
  } catch (error) {
    const msg = error?.response?.data?.message || error?.message || 'Something went wrong.';
    dispatch({ type: 'SET_ERROR', payload: msg });
    alert(msg);
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};


  const handleSignup = () => {
    navigate('/signup');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: 'SET_FORGOT_ERROR', payload: '' });
    dispatch({ type: 'SET_FORGOT_SUCCESS', payload: '' });
    dispatch({ type: 'SET_FORGOT_LOADING', payload: true });

    try {
      const response = await axios.post(
        `${apiUrl}/forgot-password`,
        { email: forgotEmail },
        { headers: { 'ngrok-skip-browser-warning': 'true' } }
      );

      dispatch({ type: 'SET_FORGOT_SUCCESS', payload: response.data.message });

      setTimeout(() => {
        dispatch({ type: 'SET_FIELD', field: 'showForgotPasswordModal', value: false });
      }, 5000);
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to send reset link.';
      dispatch({ type: 'SET_FORGOT_ERROR', payload: msg });
    } finally {
      dispatch({ type: 'SET_FORGOT_LOADING', payload: false });
    }
  };

  return (
    <div className="login">
    <div className="login-box">
      <div className="login-left">
        <Link to={ROUTES.LANDING} className="login-left-top">
          <p>Concorde</p>
        </Link>
        <div className="login-left-bottom">
          <img src={login_sailor} alt="sailor picture" />
        </div>
      </div>

      <div className="login-right">
        {/* <div className="login-right-padding"> */}
          <div className="login-right-header">
            <p className="login-right-header-medium">Jump back in</p>
            <p className="login-right-header-bold">Welcome back</p>
          </div>

          <form className="login-right-form" onSubmit={handleLogin}>
            <div className="login-right-form-input">
              <article className="login-right-form-input-email">
                <label htmlFor="login-email-id">Email</label>
                <input
                  type="email"
                  id="login-email-id"
                  placeholder="E.g. juandelacruz@example.com"
                  required
                  value={email}
                  onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
                />
              </article>

              <article className="login-right-form-input-password">
                <label htmlFor="login-password-id">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password-id"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
                  style={{ width: '100%', paddingRight: '40px' }}
                />
                <div
                  onClick={() => dispatch({ type: 'TOGGLE', field: 'showPassword' })}
                  onMouseDown={(e) => e.preventDefault()} 
                  className="password-toggle-icon"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <Show style={{ width: '24px', height: '24px', color: 'var(--primary-color)' }} />
                    
                  ) : (
                    
                    <Hide style={{ width: '24px', height: '24px', color: 'var(--primary-color)' }} />
                  )}
                </div>
              </article>

            </div>
            

            <div className="login-right-options">
              <div className="login-right-options-remember">
                <input
                  type="checkbox"
                  id="remember-checkbox-id"
                  checked={rememberMe}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    dispatch({ type: 'SET_REMEMBER_ME', payload: checked });
                    if (!checked) localStorage.removeItem('rememberedEmail');
                  }}
                />
                <label htmlFor="remember-checkbox-id">Remember me</label>
              </div>

              <div className="login-right-options-forgot">
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_FIELD', field: 'showForgotPasswordModal', value: true })}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <div className="login-right-button">
              <button type="submit" disabled={loginLoading}>
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="login-right-signup">
            <p className="login-right-signup-text">Don't have an account yet?</p>
            <button id="signup-button" onClick={handleSignup}>
              Sign up
            </button>
          </div>
        {/* </div> */}
      </div>
      </div>

      {showForgotPasswordModal && (
        <ForgotPassword
          forgotEmail={forgotEmail}
          forgotError={forgotError}
          forgotSuccess={forgotSuccess}
          forgotLoading={forgotLoading}
          onClose={() => dispatch({ type: 'SET_FIELD', field: 'showForgotPasswordModal', value: false })}
          onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'forgotEmail', value: e.target.value })}
          onSubmit={handleForgotPassword}
        />
      )}


      {/* {showForgotPasswordModal && (
        <div className="login-forgot-password-modal">
          <div className="login-forgot-password-modal-box">
            <div className="login-forgot-password-modal-box-in">
              <div className="login-forgot-password-modal-box-in-top">
                <p className="login-forgot-password-modal-box-in-top-bold">Forgot Password?</p>
                <p className="login-forgot-password-modal-box-in-top-medium">Don't worry! We'll send an email to update your password</p>
              </div>
              <div className="login-forgot-password-modal-box-in-bot">

                <form className="login-forgot-password-modal-box-in-bot-form" onSubmit={handleForgotPassword}>
                  <article>
                    <label htmlFor="forgot-email-id">Email</label>
                    <input
                      type="email"
                      id="forgot-email-id"
                      value={forgotEmail}
                      onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'forgotEmail', value: e.target.value })}
                      required
                    />
                  </article>
                  {forgotError && <p style={{ color: 'red' }}>{forgotError}</p>}
                  {forgotSuccess && <p style={{ color: 'green' }}>{forgotSuccess}</p>}

                  <div className="login-forgot-password-modal-box-in-bot-form-buttons">
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'SET_FIELD', field: 'showForgotPasswordModal', value: false })}
                      className="login-forgot-password-modal-box-in-bot-form-buttons-cancel"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={forgotLoading} 
                      className="login-forgot-password-modal-box-in-bot-form-buttons"
                    >
                      {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )} */}

    </div>
  );
};

export default Login;
