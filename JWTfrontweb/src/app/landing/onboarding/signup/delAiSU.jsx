import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

import SignupForm from './ui/SignupForm';

import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';

const Signup = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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

    if (name === 'password') {
      setPassword(sanitizedValue);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(sanitizedValue);
    } else {
      setFormData({ ...formData, [name]: sanitizedValue });
    }
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

    const passwordErrors = validatePassword(password, confirmPassword);
    if (passwordErrors.password) newErrors.password = passwordErrors.password;
    if (passwordErrors.confirmPassword) newErrors.confirmPassword = passwordErrors.confirmPassword;

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const role = formData.email.endsWith('@friendmar.com.ph') ? 'admin' : 'user';
    const dataToSend = {
      ...formData,
      password,
      middle_name: formData.middle_name.trim() === '' ? null : formData.middle_name.trim(),
      role,
    };

    try {
      const response = await axios.post(`${apiUrl}/signup`, dataToSend);
      alert('Signup Successful!');
      setFormData({ first_name: '', middle_name: '', last_name: '', email: '', mobile: '', password: '' });
      setPassword('');
      setConfirmPassword('');
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || 'Something went wrong!');
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password, confirmPassword, email = '') => {
    const errors = {};

    const rules = [
      { test: password.length >= 8, message: 'Password must be at least 8 characters long.' },
      { test: /[A-Z]/.test(password), message: 'Must contain at least one uppercase letter.' },
      { test: /[a-z]/.test(password), message: 'Must contain at least one lowercase letter.' },
      { test: /[0-9]/.test(password), message: 'Must contain at least one number.' },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), message: 'Must contain at least one special character.' },
      { test: !/\s/.test(password), message: 'Must not contain spaces.' },
      { test: !email || password.toLowerCase() !== email.toLowerCase(), message: 'Password should not be the same as your email.' },
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

  const handleTogglePassword = () => setShowPassword(prev => !prev);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(prev => !prev);
  const handleLoginClick = () => navigate('/login');

  return (
    <div className="signup">
      <div className="signup-left">
        <div className="signup-left-padding">
          <div className="signup-left-top">
            <Circle_Primary style={{ width: '20px', height: '20px' }} />
          </div>
          <div className="signup-left-bottom">
            <Circle_Primary style={{ width: '20px', height: '20px' }} />
          </div>
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-right-padding">
          <div className="signup-right-header">
            <p className="signup-right-header-sub">Start for free</p>
            <p className="signup-right-header-main">Create an account</p>
          </div>

          <SignupForm
            formData={formData}
            setFormData={setFormData}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            errors={errors}
            loading={loading}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleTogglePassword={handleTogglePassword}
            handleToggleConfirmPassword={handleToggleConfirmPassword}
          />

          <div className="signup-right-login">
            <p className="signup-right-login-text">Already have an account? </p>
            <button className="signup-right-login-button" onClick={handleLoginClick}>Log in</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
