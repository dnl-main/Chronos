// Forgot.jsx
import React from 'react';
import './forgotPassword.css';

const ForgotPassword = ({
  forgotEmail,
  forgotError,
  forgotSuccess,
  forgotLoading,
  onClose,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="login-forgot-password-modal">
      <div className="login-forgot-password-modal-box">
        <div className="login-forgot-password-modal-box-in">
          <div className="login-forgot-password-modal-box-in-top">
            <p className="login-forgot-password-modal-box-in-top-bold">Forgot Password?</p>
            <p className="login-forgot-password-modal-box-in-top-medium">
              Don't worry! We'll send an email to update your password
            </p>
          </div>
          <div className="login-forgot-password-modal-box-in-bot">

            <div className="login-forgot-password-modal-box-in-bot-message">
              {forgotError && <p style={{ color: 'var(--red-indicator)'}}>{forgotError}</p>}
              {forgotSuccess && <p style={{ color: 'var(--green-indicator)'}}>{forgotSuccess}</p>}
            </div>
            
            <form className="login-forgot-password-modal-box-in-bot-form" onSubmit={onSubmit}>
              <article>
                <label htmlFor="forgot-email-id">Email</label>
                <input
                  type="email"
                  id="forgot-email-id"
                  placeholder="Enter your email address"
                  value={forgotEmail}
                  onChange={onChange}
                  required
                />
              </article>
              

              <div className="login-forgot-password-modal-box-in-bot-form-buttons">
                <button
                  type="button"
                  onClick={onClose}
                  className="login-forgot-password-modal-box-in-bot-form-buttons-close"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="login-forgot-password-modal-box-in-bot-form-buttons-submit"
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
