import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

// import concorde from '../../assets/logo/concorde.png';
// import signup_auth from '../../assets/overlay/signup_auth.png';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();






const handleChange = (e) => {
  const { name, value } = e.target;
  let sanitizedValue = value;

  // Sanitize name fields: only allow letters, spaces, and hyphens
  if (['first_name', 'middle_name', 'last_name'].includes(name)) {
    sanitizedValue = value.replace(/[^a-zA-Z\s\-]/g, '');
  }

  // Sanitize mobile number: allow only digits
  if (name === 'mobile') {
    sanitizedValue = value.replace(/\D/g, '');
  }

  // Lowercase email input for consistency
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

  // Name validations
  if (!formData.first_name.trim()) {
    newErrors.first_name = ['First name is required.'];
  }
  if (!formData.last_name.trim()) {
    newErrors.last_name = ['Last name is required.'];
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = ['Email is required.'];
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = ['Enter a valid email address.'];
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = ['Mobile number is required.'];
    } else if (!/^\d{10,15}$/.test(formData.mobile)) {
      newErrors.mobile = ['Enter a valid mobile number (10-15 digits).'];
    }

    // Merge with password validation
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

  // Combine failed messages
  const failedMessages = rules.filter(rule => !rule.test).map(rule => rule.message);
  if (failedMessages.length > 0) {
    errors.password = failedMessages.join(' ');
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};


const handleTogglePassword = () => {
  setShowPassword(prev => !prev);
};

const handleToggleConfirmPassword = () => {
  setShowConfirmPassword(prev => !prev);
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
      <div className="signup-left">
        <div className="signup-left-padding">
          <div className="signup-left-top">
            {/* <img src={concorde} alt="Concorde logo" /> */}
            <Circle_Primary style={{ width: '20px', height: '20px' }} />
          </div>
          <div className="signup-left-bottom">
            {/* <img src={signup_auth} alt="Big picture" /> */}
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

          {/* Form */}
          <form className="signup-right-form" onSubmit={handleSubmit}>
            <div className="signup-right-form-name">
              <label>First name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
              {errors.first_name && <p className="error-message">{errors.first_name[0]}</p>}
            </div>

            <div className="signup-right-form-name">
              <label>Middle name</label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                placeholder="Enter your middle name"
              />
            </div>

            <div className="signup-right-form-name">
              <label>Last name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />
              {errors.last_name && <p className="error-message">{errors.last_name[0]}</p>}
            </div>

            <div className="signup-right-form-email">
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
            </div>

            <div className="signup-right-form-mobile">
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
            </div>

            <div className="signup-right-form-password" style={{ position: 'relative' }}>
              <label>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <div
                className={`password-toggle ${showPassword ? 'visible' : 'hidden'}`}
                onClick={handleTogglePassword}
                title={showPassword ? 'Hide password' : 'Show password'}
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            <div className="signup-right-form-password" style={{ position: 'relative' }}>
              <label>Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <div
                className={`password-toggle ${showConfirmPassword ? 'visible' : 'hidden'}`}
                onClick={handleToggleConfirmPassword}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>


            {/*TNC*/}
            <div className="signup-right-terms">
              <div className="signup-right-terms-checkbox">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">By signing up I agree with </label>
              </div>
              <div className="signup-right-terms-content">
                <button type="button" id="terms-content" onClick={openModal}>
                  Terms and Conditions <span style={{ color: 'red' }}>*</span>
                </button>
              </div>
            </div>

            {/* Terms and Conditions Modal */}
            {isModalVisible && (
              <div className="modal-tnc-overlay">
                <div className="modal-tnc-content">
                <h2>Terms and Conditions</h2>
                <br></br>
<p>
  <strong>For Centralized Data Management for Optimized Crew Scheduling System in Friendly Maritime Services Inc.</strong>
</p>

<ol>
  <li>
    <strong>Acceptance of Terms</strong><br />
    By accessing or using the Centralized Data Management for Optimized Crew Scheduling System ("the System"), you ("User" or "FMS") agree to be bound by these Terms and Conditions ("Terms"). If you do not agree, you must immediately discontinue use.
  </li>

  <li>
    <strong>System Overview</strong><br />
    The System provides:
    <ul>
      <li>Automated crew scheduling and deployment optimization</li>
      <li>Certification tracking and compliance management</li>
      <li>Data analytics for workforce planning</li>
    </ul>
  </li>

  <li>
    <strong>User Accounts</strong>
    <ol type="a">
      <li>
        <strong>Registration</strong>
        <ul>
          <li>Must provide accurate and current information</li>
          <li>Each user receives unique login credentials</li>
        </ul>
      </li>
      <li>
        <strong>Account Security</strong>
        <ul>
          <li>Users are responsible for maintaining confidentiality</li>
          <li>Must immediately report unauthorized access</li>
        </ul>
      </li>
    </ol>
  </li>

  <li>
    <strong>Data Management</strong>
    <ol type="a">
      <li>
        <strong>Data Collected</strong>
        <ul>
          <li><strong>Admin Profiles:</strong> Full Name, Job Title, Department, Contact Number, Email</li>
          <li><strong>User Profiles:</strong> Full Name, Gender, Birthday, Civil Status, Gmail, Phone Number, Address Information (Building No. & Street, Barangay, City/Municipality, Province, Region, Zip Code), Employment Details (Position, Employee ID)</li>
          <li><strong>Employment Data:</strong> Rank/Position, Assigned Vessel, Contract Details (Start/End Date, Type)</li>
          <li><strong>Certifications and Trainings:</strong> License/Certification Name, Training Records, Medical Certificates, Issue Date, Expiry Date</li>
          <li><strong>Scheduling and Deployment:</strong> Availability Status (Active/On Leave/Unavailable), Onboarding Date, Offboarding Date, Assignment Schedule</li>
        </ul>
      </li>
      <li>
        <strong>Data Use</strong>
        <ul>
          <li>Solely for maritime crew management purposes</li>
          <li>No commercial use or third-party sharing without consent</li>
        </ul>
      </li>
      <li>
        <strong>Data Retention</strong>
        <ul>
          <li>Active crew data retained indefinitely</li>
          <li>Inactive data anonymized after 2 years</li>
        </ul>
      </li>
    </ol>
  </li>

  <li>
    <strong>User Obligations</strong>
    <ol type="a">
      <li>
        <strong>FMS agrees to:</strong>
        <ul>
          <li>Maintain accurate crew records</li>
          <li>Obtain necessary consents for data processing</li>
          <li>Use the System only for intended purposes</li>
        </ul>
      </li>
      <li>
        <strong>Prohibited Actions:</strong>
        <ul>
          <li>Reverse engineering or copying System features</li>
          <li>Using the System for unlawful purposes</li>
        </ul>
      </li>
    </ol>
  </li>

  <li>
    <strong>Intellectual Property</strong><br />
    All System software, algorithms, and interfaces remain property of The Researchers. FMS is granted a limited, non-exclusive license to use the System.
  </li>

  <li>
    <strong>Privacy and Security</strong>
    <ol type="a">
      <li>
        <strong>Security Measures</strong>
        <ul>
          <li>Data encryption in transit and at rest</li>
          <li>Regular security audits</li>
        </ul>
      </li>
      <li>
        <strong>Breach Notification</strong>
        <ul>
          <li>Any breach must be reported within 24 hours</li>
        </ul>
      </li>
    </ol>
  </li>

  <li>
    <strong>Limitation of Liability</strong><br />
    The Researchers are not liable for:
    <ul>
      <li>Indirect or consequential damages</li>
      <li>Data loss due to user negligence</li>
    </ul>
  </li>

  <li>
    <strong>Termination</strong>
    <ul>
      <li>Either party may terminate with 30 days' notice</li>
      <li>Upon termination:
        <ul>
          <li>All access revoked</li>
          <li>Data returned or securely deleted</li>
        </ul>
      </li>
    </ul>
  </li>

  <li>
    <strong>Modifications</strong>
    <ul>
      <li>Terms may be updated with 15 days' notice</li>
      <li>Continued use constitutes acceptance</li>
    </ul>
  </li>
</ol>

  
                  <div className="modal-button">
                  <button onClick={closeModal}>Close</button>
                  </div>
                </div>
              </div>
            )}

            <div className="signup-right-button">
              <button type="submit" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </div>
          </form>

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