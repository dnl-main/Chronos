import React, { useState } from 'react';
import './resetpassword.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';

const ResetPassword = ({ closeResetPassword }) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    // Frontend validation
    const newErrors = {};
    if (!currentPassword) newErrors.currentPassword = 'Current password is required.';
    if (!newPassword) newErrors.newPassword = 'New password is required.';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm password is required.';
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.newPassword = 'Passwords do not match.';
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.alert('Please fix the errors in the form.');
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        const errorMsg = 'You are not authenticated. Please log in.';
        setErrors({ currentPassword: errorMsg, newPassword: '', confirmPassword: '' });
        window.alert(errorMsg);
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${apiUrl}/change-password`,
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const successMsg = response.data.message || 'Password updated successfully.';
      setSuccess(successMsg);
      window.alert(successMsg);
      setErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
 
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      setTimeout(() => {
        closeResetPassword(false);
        navigate('/login');
      }, 500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update password.';
      setErrors({ currentPassword: errorMsg, newPassword: '', confirmPassword: '' });
      window.alert(errorMsg);
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resetPW">
      <div className="resetPW-main">
        <header className="resetPW-main-header">
          <div className="resetPW-main-header-core">
            <div className="resetPW-main-header-core-svg">
              <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
            </div>
            <div className="resetPW-main-header-core-text">
              <p className="resetPW-main-header-core-text-semibold">Change password</p>
              <p className="resetPW-main-header-core-text-light">Always update your password</p>
            </div>
          </div>
          <div className="resetPW-main-header-line"></div>
        </header>

        <form className="resetPW-main-fields" onSubmit={handleSubmit}>
          <div className="resetPW-main-fields-current" style={{ position: 'relative' }}>
            <label htmlFor="currentPassword">Current password</label>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter your current password"
              required
              style={{ width: '100%', paddingRight: '40px' }}
            />
            <div
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '45px',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                height: '20px',
                width: '20px',
                borderRadius: '50%',
                backgroundColor: showCurrentPassword ? '#00889a' : '#ccc',
                zIndex: 1,
              }}
              title={showCurrentPassword ? 'Hide password' : 'Show password'}
            />
            {errors.currentPassword && <p className="error-message">{errors.currentPassword}</p>}
          </div>
          <div className="resetPW-main-fields-new">
            <div style={{ position: 'relative' }}>
              <label htmlFor="newPassword">New password</label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter your new password"
                required
                style={{ width: '100%', paddingRight: '40px' }}
        
              />
              <div
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '37px',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  height: '20px',
                  width: '20px',
                  borderRadius: '50%',
                  backgroundColor: showNewPassword ? '#00889a' : '#ccc',
                  zIndex: 1,
                }}
                title={showNewPassword ? 'Hide password' : 'Show password'}
              />
              {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}
            </div>
            <div style={{ position: 'relative' }}>
              <label htmlFor="confirmPassword">Confirm new password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                style={{ width: '100%', paddingRight: '40px' }}
          
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '37px',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  height: '20px',
                  width: '20px',
                  borderRadius: '50%',
                  backgroundColor: showConfirmPassword ? '#00889a' : '#ccc',
                  zIndex: 1,
                }}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>
          </div>
          {success && <p className="resetPW-success" style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
          <div className="resetPW-main-buttons">
            <button
              type="button"
              className="resetPW-main-buttons-cancel"
              onClick={() => closeResetPassword(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="resetPW-main-buttons-confirm"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;