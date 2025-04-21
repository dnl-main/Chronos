import React, { useState } from 'react';
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
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from submitting and refreshing the page
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setError(''); // Clear previous errors
    setLoading(true); // Set loading to true during request

    try {
      // Step 1: Send login request with email and password
      console.log('Sending login request:', { email, password }); // Debug payload
      const response = await axios.post(`${apiUrl}/login`, { email, password });

      // Step 2: Check for token and user data
      if (response.data.status && response.data.token) {
        // Check if the email domain is "@friendmar.com.ph"
        if (email.endsWith('@friendmar.com.ph')) {
          response.data.user.role = 'admin'; // Assign 'admin' role to this user
        }

        // Store token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Login successful:', response.data.message);

        // Conditionally navigate based on role and region
        if (response.data.user.role === 'admin') {
          navigate('/admin/home'); // Redirect to admin dashboard
        } else if (response.data.user.region) {
          navigate('/user/homeUser'); // Navigate to home user if region exists
        } else {
          navigate('/Registration'); // Redirect to registration if region is null
        }
      } else {
        setError('Invalid credentials or incomplete response. Please try again.');
        alert('Invalid credentials. Please check your email and password and try again.');
      }
    } catch (error) {
      console.error('Login failed:', error); // Log full error
      if (error.response) {
        console.log('Response data:', error.response.data); // Log backend response
        console.log('Status code:', error.response.status); // Log status code
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
      setLoading(false); // Reset loading state after request completes
    }
  };

  const handleSignup = () => {
    navigate('/signup'); // Navigates to signup.jsx
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
            <form id="login-form" className="login-right-form-form" onSubmit={handleLogin}>
              <div className="login-right-form-email">
                <label htmlFor="login-email-id">Email</label>
                <input 
                  type="email"
                  id="login-email-id"
                  name="login-email"
                  placeholder="E.g. juandelacruz@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  style={{
                    width: '100%',
                    paddingRight: '40px' 
                  }}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '55px',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    height: '20px',
                    width: '20px',
                    borderRadius: '50%',
                    backgroundColor: showPassword ? '#00889a' : '#ccc',
                    zIndex: 1
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                />
              </div>
              <div className="login-right-options">
                <div className="login-right-options-remember">
                  <input type="checkbox" id="remember-checkbox-id" name="remember-checkbox" />
                  <label htmlFor="remember-checkbox-id">Remember me</label>
                </div>
                <div className="login-right-options-forgot">
                  <button type="button" id="forgot_password-id" name="forgot_password">
                    Forgot Password?
                  </button>
                </div>
              </div>
              <div className="login-right-button">
                <button type="submit" id="login-submit-button-id" name="login-button" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>

          <div className="login-right-spacer"></div>

          <div className="login-right-signup">
            <p className="login-right-signup-text">Don't have an account yet? </p>
            <button id="signup-button" onClick={handleSignup}>Sign up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
