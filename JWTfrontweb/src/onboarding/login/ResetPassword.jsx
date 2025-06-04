import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './reset-password.css';

const ResetPassword = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get('token');


  if (!token) {
    // console.warn('Missing token, redirecting to /login');
    navigate('/login');
    return null;
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);


    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
const response = await axios.post(
    `${apiUrl}/reset-password`,
    {
      token,
      password,
      password_confirmation: passwordConfirmation,
    },
    {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
      setSuccess(response.data.message || 'Password reset successfully. You can now log in.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Failed to reset password. Please try again.');
      } else {
        setError('No response from server. Please check your network or server status.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password">
      <div className="reset-password-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword} style={{ marginTop: '20px' }}>
          <div className="input-container" style={{ marginTop: '20px', position: 'relative' }}>
            <label htmlFor="password-id">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password-id"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(5%)',
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
          <div className="input-container" style={{ marginTop: '20px', position: 'relative' }}>
            <label htmlFor="password-confirmation-id">Confirm Password</label>
            <input
              type={showPasswordConfirmation ? 'text' : 'password'}
              id="password-confirmation-id"
              placeholder="Confirm new password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
            <div
              onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(1%)',
                cursor: 'pointer',
                height: '20px',
                width: '20px',
                borderRadius: '50%',
                backgroundColor: showPasswordConfirmation ? '#00889A' : '#ccc',
                zIndex: 1,
              }}
              title={showPasswordConfirmation ? 'Hide password' : 'Show password'}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <div style={{ marginTop: '20px' }}>
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;