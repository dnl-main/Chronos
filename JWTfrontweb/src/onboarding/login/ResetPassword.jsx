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
  const navigate = useNavigate();

  const token = searchParams.get('token');


  // Comment out
  if (!token) {
    console.warn('Missing token, redirecting to /login');
    navigate('/login');
    return null;
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate inputs
    if (!email) {
      setError('Email is required.');
      setLoading(false);
      return;
    }
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/reset-password`, {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

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
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="password-id">New Password</label>
            <input
              type="password"
              id="password-id"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="password-confirmation-id">Confirm Password</label>
            <input
              type="password"
              id="password-confirmation-id"
              placeholder="Confirm new password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
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