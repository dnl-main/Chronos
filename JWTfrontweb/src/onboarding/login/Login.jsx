import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

import concorde from '../../assets/logo/concorde.png';
import login_sailor from '../../assets/overlay/login_sailor.png';
axios.defaults.withCredentials = true;

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [hasPreFilled, setHasPreFilled] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail && !hasPreFilled) {
      setEmail(savedEmail);
      setRememberMe(true);
      setHasPreFilled(true);
    }
  }, []);

  const handleRememberMeChange = (e) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    if (!isChecked) {
      localStorage.removeItem('rememberedEmail');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    setError('');
    setLoginLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/login`, { email, password });

      if (response.data.status && response.data.token) {
        if (email.endsWith('@friendmar.com.ph')) {
          response.data.user.role = 'admin';
        }

        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        sessionStorage.setItem('justLoggedIn', 'true');

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        }

        // Conditionally navigate based on role and region
        if (response.data.user.role === 'admin') {
          navigate('/admin/home');
        } else if (response.data.user.region) {
          navigate('/user/homeUser');
        } else {
          navigate('/Registration');
        }
      } else {
        setError('Invalid credentials or incomplete response. Please try again.');
        alert('Invalid credentials. Please check your email and password and try again.');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Login failed. Please check your credentials.');
        alert(error.response.data.message || 'Login failed. Please check your credentials.');
      } else if (error.request) {
        setError('No response from server. Please check your network or server status.');
        alert('No response from server. Please check your network or server status.');
      } else {
        setError('Something went wrong. Please try again.');
        alert('Something went wrong. Please try again.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/forgot-password`, { email: forgotEmail });
      setForgotSuccess(response.data.message || 'Password reset link sent to your email.');
      setShowForgotPasswordModal(false);
    } catch (error) {
      if (error.response) {
        setForgotError(error.response.data.message || 'Failed to send reset link. Please try again.');
      } else {
        setForgotError('No response from server. Please check your network or server status.');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-left">
        <div className="login-left-top">
          <img src={concorde} alt="Concorde logo" />
        </div>
        <div className="login-left-bottom">
          <img src={login_sailor} alt="Big picture" />
        </div>
      </div>

      <div className="login-right">
        <div className="login-right-padding">
          <div className="login-right-header">
            <p className="login-right-header-sub">Jump back in</p>
            <p className="login-right-header-heading">Welcome back</p>
          </div>

          <div className="login-right-form">
            <form
              id="login-form"
              className="login-right-form-form"
              onSubmit={handleLogin}
              autoComplete="off"
              style={{ marginTop: '20px' }}
            >
              <div className="login-right-form-email">
                <label htmlFor="login-email-id">Email</label>
                <input
                  type="email"
                  id="login-email-id"
                  name="login-email"
                  placeholder="E.g. juandelacruz@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="login-right-form-password" style={{ position: 'relative', width: '100%' }}>
                <label htmlFor="login-password-id">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password-id"
                  name="login-password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingRight: '40px' }}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
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
                    name="remember-checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                  />
                  <label htmlFor="remember-checkbox-id">Remember me</label>
                </div>
                <div className="login-right-options-forgot">
                  <button
                    type="button"
                    id="forgot_password-id"
                    name="forgot_password"
                    onClick={() => setShowForgotPasswordModal(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
              <div className="login-right-button" style={{ marginTop: '20px' }}>
                <button type="submit" id="login-submit-button-id" name="login-button" disabled={loginLoading}>
                  {loginLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>

          <div className="login-right-spacer">
            <div className="login-right-signup">
              <p className="login-right-signup-text">Don't have an account yet? </p>
              <button id="signup-button" onClick={handleSignup}>
                Sign up
              </button>
            </div>
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
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              {forgotError && <p style={{ color: 'red' }}>{forgotError}</p>}
              {forgotSuccess && <p style={{ color: 'green' }}>{forgotSuccess}</p>}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="forgot-password-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="forgot-password-submit"
                >
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