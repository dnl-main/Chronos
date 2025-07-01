import axios from 'axios';
import React, { useState, useEffect } from 'react'; // ✏️ added useEffect
import { useNavigate, Link } from 'react-router-dom';
import './signup.css';

import { ROUTES } from '../../../router/routes';

import TermsModal from './modals/TermsModal';
import SuccessModal from '../register/modals/SuccessModal';

import login_sailor from '../../../../assets/photo/login_sailor.png';

import Hide from '../../../../assets/icons/Hide.svg?react';
import Show from '../../../../assets/icons/Show.svg?react';

const Signup = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [showSuccessModal, setShowSuccessModal] = useState(null);





  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPasswordLocal, setShowConfirmPasswordLocal] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [errorPopup, setErrorPopup] = useState([]); // 🆕 for popup message
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (errorPopup.length > 0) {
      const timer = setTimeout(() => setErrorPopup([]), 7500); // 🆕 auto-hide popup
      return () => clearTimeout(timer);
    }
  }, [errorPopup]); // 🆕

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    if (['first_name', 'middle_name', 'last_name'].includes(name)) {
      sanitizedValue = value.replace(/[^a-zA-Z\s\-]/g, '');
    }

    if (name === 'mobile') {
      sanitizedValue = value.replace(/\D/g, '');
    }

    if (name === 'email') {
      sanitizedValue = value.toLowerCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = ['First name is required.'];
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = ['Last name is required.'];
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = ['Email is required.'];
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = ['Enter a valid email address.'];
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = ['Mobile number is required.'];
    } else if (!/^\d{10,15}$/.test(formData.mobile)) {
      newErrors.mobile = ['Enter a valid mobile number (10-15 digits).'];
    }

    const passwordErrors = validatePassword(formData.password, formData.confirmPassword, formData.email);
    if (passwordErrors.password) newErrors.password = [passwordErrors.password];
    if (passwordErrors.confirmPassword) newErrors.confirmPassword = [passwordErrors.confirmPassword];

    return newErrors;
  };

  const extractAllErrors = (errorObj) => { // 🆕
    return Object.values(errorObj).flat();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setErrorPopup([]);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setErrorPopup(extractAllErrors(validationErrors)); // 🆕 show popup
      setLoading(false);
      return;
    }

    const role = formData.email.endsWith('@friendmar.com.ph') ? 'admin' : 'user';
    const dataToSend = {
      ...formData,
      middle_name: formData.middle_name.trim() === '' ? null : formData.middle_name.trim(),
      role,
    };

    try {
      const response = await axios.post(`${apiUrl}/signup`, dataToSend);
      // Show success modal instead of alert and immediate redirect
      setShowSuccessModal({
        type: 'signup',
        userFirstName: formData.first_name,
      });


      // Optionally reset form fields
      setFormData({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
      });
      // alert('Signup Successful!');
      // setFormData({
      //   first_name: '',
      //   middle_name: '',
      //   last_name: '',
      //   email: '',
      //   mobile: '',
      //   password: '',
      //   confirmPassword: ''
      // });
      // navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
        setErrorPopup(extractAllErrors(error.response.data.errors)); // 🆕
      } else {
        setErrorPopup([error.response?.data?.message || 'Something went wrong!']); // 🆕
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password, confirmPassword, email = '') => {
    const errors = {};

    const rules = [
      {
        test: password.length >= 8,
        message: 'Password must be at least 8 characters long.'
      },
      {
        test: /[A-Z]/.test(password),
        message: 'Must contain at least one uppercase letter.'
      },
      {
        test: /[a-z]/.test(password),
        message: 'Must contain at least one lowercase letter.'
      },
      {
        test: /[0-9]/.test(password),
        message: 'Must contain at least one number.'
      },
      {
        test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        message: 'Must contain at least one special character.'
      },
      {
        test: !/\s/.test(password),
        message: 'Must not contain spaces.'
      },
      {
        test: !email || password.toLowerCase() !== email.toLowerCase(),
        message: 'Password should not be the same as your email.'
      }
    ];

    const failedMessages = rules.filter(rule => !rule.test).map(rule => rule.message);
    if (failedMessages.length > 0) {
      errors.password = failedMessages.join(' ');
    }

    if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };


  return (
    <div className="signup">
    <div className="signup-box">
      <div className="signup-left">
        <Link to={ROUTES.LANDING} className="signup-left-top">
          <p>Concorde</p>
        </Link> {/* signup-left-top */}
        <div className="signup-left-bottom">
          <img src={login_sailor} alt="sailor picture" />
        </div> {/* signup-left-bottom */}
      </div> {/* signup-left */}

      <div className="signup-right">
        <div className="signup-right-header">
          <p className="signup-right-header-medium">Start for free</p>
          <p className="signup-right-header-bold">Create an account</p>

          {errorPopup.length > 0 && ( // 🆕 Error Popup Component
            <div className="signup-error-popup">
              <div className="signup-error-popup-header">
                <p>Make sure fields are answered correctly</p>
                <button onClick={() => setErrorPopup([])}>✖</button>
              </div>
              
              <div className="signup-error-popup-list">
                {errorPopup.map((err, idx) => (
                  <p key={idx} className="signup-error-popup-item">• {err}</p>
                ))}
              </div>
            </div>
          )}
        </div> {/* signup-right-header */}

        <form className="signup-right-form" onSubmit={handleSubmit}>
          <section className="signup-right-form-input">
            <aside className="signup-right-form-input-name">
              <article className="signup-right-form-input-name-first">
                <label>First name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="E.g. Juan"
                  required
                />
                {errors.first_name && <p className="error-message">{errors.first_name[0]}</p>}
              </article> {/* signup-right-form-input-name */}

              <article className="signup-right-form-input-name-middle">
                <label>Middle name</label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  placeholder="Dela"
                />
              </article> {/* signup-right-form-input-name-middle */}

              <article className="signup-right-form-input-name-last">
                <label>Last name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Cruz"
                  required
                />
                {errors.last_name && <p className="error-message">{errors.last_name[0]}</p>}
              </article> {/* signup-right-form-input-name-last */}
            </aside> {/* signup-right-form-input-name */}

            <aside className="signup-right-form-input-contact">
              <article className="signup-right-form-input-contact-email">
                <label>Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
                {errors.email && <p className="error-message">{errors.email[0]}</p>}
              </article> {/* signup-right-form-input-contact-email */}

              <article className="signup-right-form-input-contact-mobile">
                <label>Mobile number</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  required
                />
                {errors.mobile && <p className="error-message">{errors.mobile[0]}</p>}
              </article> {/* signup-right-form-input-contact-mobile */}
            </aside> {/* signup-right-form-input-contact */}

            <aside className="signup-right-form-input-password">
              <article className="signup-right-form-input-password-initial">
                <label>Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <div
                  onClick={() => setShowPassword((prev) => !prev)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="password-toggle-icon-2"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <Show style={{ width: '24px', height: '24px', color: 'var(--primary-color)' }} />
                  ) : (
                    <Hide style={{ width: '24px', height: '24px', color: 'var(--primary-color)' }} />
                  )}
                </div>
              </article> {/* signup-right-form-input-password-iniital */}

              <article className="signup-right-form-input-password-confirm">
                <label>Confirm Password</label>
                <input
                  type={showConfirmPasswordLocal ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
                <div
                  onClick={() => setShowConfirmPasswordLocal(prev => !prev)} 
                  onMouseDown={(e) => e.preventDefault()}
                  className="password-toggle-icon"
                  title={showConfirmPasswordLocal ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPasswordLocal ? (
                    <Show style={{ width: '24px', height: '24px', color: 'var(--primary-color)' }} />
                  ) : (
                    <Hide style={{ width: '24px', height: '24px', color: 'var(--primary-color)' }} />
                  )}
                </div>
              </article> {/* signup-right-form-input-password-confirm */}
              
            </aside> {/* signup-right-form-input-password */}
          </section> {/* signup-right-form-input */}

          <section className="signup-right-form-terms">
            <div className="signup-right-form-terms-checkbox">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">By signing up I agree with </label>
            </div> {/* signup-right-form-terms-checkbox */}
             

            <div className="signup-right-form-terms-content">
              <button type="button" id="terms-content" onClick={openModal}>
                <p className="signup-right-form-terms-content-regular">Terms and Conditions</p>
                <p className="signup-right-form-terms-content-bold">*</p>
              </button>
            </div> {/* signup-right-form-terms-content */}

            {/* Terms and Conditions Modal */}
            <TermsModal isVisible={isModalVisible} closeModal={closeModal} />
          </section> {/* signup-right-form-terms */}

          

          <section className="signup-right-form-button">
            <button type="submit" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </section>

          
        </form> {/* signup-right-form */}
        <section className="signup-right-form-login">
          <p className="signup-right-form-login-regular">Already have an account? </p>
          <button onClick={handleLoginClick}>Log in</button>
        </section> {/* signup-right-form-button */}

        {showSuccessModal && (
          <SuccessModal
            type={showSuccessModal.type}
            userFirstName={showSuccessModal.userFirstName}
            message="Signup successful!"
            onConfirm={() => navigate('/login')}
            countdownStart={5}
          />
        )}

      </div> {/* signup-right */}
    </div> {/* signup-box */}
    </div> // signup
  );
};

export default Signup;