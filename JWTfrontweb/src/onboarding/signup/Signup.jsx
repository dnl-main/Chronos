import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import concorde from '../../assets/logo/concorde.png';
import signup_auth from '../../assets/overlay/signup_auth.png';

const Signup = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const navigate = useNavigate();

  // Validate password and confirm password
  // const validatePassword = (password, confirmPassword) => {
  //   let errors = {};

  //   if (password.length < 8) {
  //     errors.length = "Password must be at least 8 characters long.";
  //   }
  //   if (!/[A-Z]/.test(password)) {
  //     errors.uppercase = "Password must contain at least one uppercase letter.";
  //   }
  //   if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
  //     errors.specialChar = "Password must contain at least one special character.";
  //   }
  //   if (confirmPassword && confirmPassword !== password) {
  //     errors.match = "Passwords do not match.";
  //   }

  //   return errors;
  // };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors
    console.log("Clicked")
  
    // // Validate passwords
    // const validationErrors = validatePassword(password, confirmPassword);
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   setLoading(false);
    //   return;
    // }
  
   
    const role = formData.email.endsWith('@friendmar.com') ? 'admin' : 'user';
    const dataToSend = {
      ...formData,
      middle_name: formData.middle_name.trim() === '' ? null : formData.middle_name.trim(),
      role,
    };
  
    try {
      const response = await axios.post(`${apiUrl}/signup`, dataToSend);
      alert('Signup Successful!');
      console.log('Response:', response.data);
  
      setFormData({ first_name: '', middle_name: '', last_name: '', email: '', mobile: '', password: '' });
  
      // Redirect based on role (admin vs user)
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/login');
      }
  
    } catch (error) {
      if (error.response) {
        console.log('Error:', error.response.data);
        if (error.response.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          alert(error.response.data.message || 'Something went wrong!');
        }
      } else {
        alert('Server error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="signup">
      <div className="signup-left">
        <div className="signup-left-padding">
          <div className="signup-left-top">
            <img src={concorde} alt="Concorde logo" />
          </div>
          <div className="signup-left-bottom">
            <img src={signup_auth} alt="Big picture" />
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

            <div className="signup-right-form-password">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              {errors.password && <p className="error-message">{errors.password[0]}</p>}
            </div>
            

            <div className="signup-right-terms">
              <div className="signup-right-terms-checkbox">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">By signing up I agree with &nbsp;</label>
              </div>
              <div className="signup-right-terms-content">
                <button type="button" id="terms-content">
                  Terms and Conditions <span style={{ color: 'red' }}>*</span>
                </button>
              </div>
            </div>

            {/* Signup Button */}
            <div className="signup-right-button">
              <button type="submit" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="signup-right-login">
            <p className="signup-right-login-text">Already have an account? &nbsp;</p>
            <button className="signup-right-login-button">Log in</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
