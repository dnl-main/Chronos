import React, { useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';
import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';
import Hide from '../../../../assets/icons/Hide.svg?react';
import Show from '../../../../assets/icons/Show.svg?react';

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

        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        sessionStorage.setItem('needs_position', JSON.stringify(response.data.needs_position));

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        }

        if (response.data.user.role === 'superadmin') {
          navigate('/superadmin/homesuperadmin');
        } else if (response.data.user.role === 'admin') {
          if (response.data.needs_position) {
            alert('You need to set your position before proceeding.');
          }
          navigate('/admin/home');
        } else if (response.data.user.region) {
          navigate('/user/homeUser');
        } else {
          navigate('/Registration');
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
      dispatch({ type: 'SET_FIELD', field: 'showForgotPasswordModal', value: false });
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to send reset link.';
      dispatch({ type: 'SET_FORGOT_ERROR', payload: msg });
    } finally {
      dispatch({ type: 'SET_FORGOT_LOADING', payload: false });
    }
  };

  return (
    <div className="login">
      {/* <Hide
        style={{
          width: '32px',
          height: '32px',
          '--stroke-color': '#555',
          '--stroke-width': '3',
          '--fill-color': 'none',
        }}
      />
      <Show
        style={{
          width: '32px',
          height: '32px',
          '--stroke-color': '#555',
          '--stroke-width': '3',
          '--fill-color': 'none',
        }}
      /> 
      <img src={login_sailor} className="landing-box-right-bg" alt="background" />
      */}
      <div className="login-left">
        <div className="login-left-top">
          <Circle_Primary style={{ width: '20px', height: '20px' }} />
        </div>
        <div className="login-left-bottom">
          <Circle_Primary style={{ width: '20px', height: '20px' }} />
        </div>
      </div>

      <div className="login-right">
        <div className="login-right-padding">
          <div className="login-right-header">
            <p className="login-right-header-sub">Jump back in</p>
            <p className="login-right-header-heading">Welcome back</p>
          </div>

          <form className="login-right-form-form" onSubmit={handleLogin} style={{ marginTop: '20px' }}>
            <div className="login-right-form-email">
              <label htmlFor="login-email-id">Email</label>
              <input
                type="email"
                id="login-email-id"
                placeholder="E.g. juandelacruz@example.com"
                required
                value={email}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
              />
            </div>

            <div className="login-right-form-password" style={{ position: 'relative', width: '100%' }}>
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
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '57px',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  height: '20px',
                  width: '20px',
                  borderRadius: '50%',
                  backgroundColor: showPassword ? '#00889A' : '#ccc',
                  zIndex: 1,
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              />
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

            <div className="login-right-button" style={{ marginTop: '20px' }}>
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
        </div>
      </div>

      {showForgotPasswordModal && (
        <div className="forgot-password-modal">
          <div className="forgot-password-modal-content">
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPassword} style={{ marginTop: '20px' }}>
              <div>
                <label htmlFor="forgot-email-id">Email</label>
                <input
                  type="email"
                  id="forgot-email-id"
                  value={forgotEmail}
                  onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'forgotEmail', value: e.target.value })}
                  required
                />
              </div>
              {forgotError && <p style={{ color: 'red' }}>{forgotError}</p>}
              {forgotSuccess && <p style={{ color: 'green' }}>{forgotSuccess}</p>}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_FIELD', field: 'showForgotPasswordModal', value: false })}
                >
                  Cancel
                </button>
                <button type="submit" disabled={forgotLoading}>
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
