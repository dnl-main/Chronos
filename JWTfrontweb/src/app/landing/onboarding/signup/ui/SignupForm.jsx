// import React, { useState } from 'react';

// const SignupForm = ({
//   formData,
//   setFormData,
//   password,
//   setPassword,
//   confirmPassword,
//   setConfirmPassword,
//   showPassword,
//   setShowPassword,
//   showConfirmPassword,
//   setShowConfirmPassword,
//   errors,
//   loading,
//   handleSubmit,
//   handleChange,
//   handleTogglePassword,
//   handleToggleConfirmPassword,
// }) => {
//   return (
//     <form className="signup-right-form" onSubmit={handleSubmit}>
//       <div className="signup-right-form-name">
//         <label>First name</label>
//         <input
//           type="text"
//           name="first_name"
//           value={formData.first_name}
//           onChange={handleChange}
//           placeholder="Enter your first name"
//           required
//         />
//         {errors.first_name && <p className="error-message">{errors.first_name[0]}</p>}
//       </div>

//       <div className="signup-right-form-name">
//         <label>Middle name</label>
//         <input
//           type="text"
//           name="middle_name"
//           value={formData.middle_name}
//           onChange={handleChange}
//           placeholder="Enter your middle name"
//         />
//       </div>

//       <div className="signup-right-form-name">
//         <label>Last name</label>
//         <input
//           type="text"
//           name="last_name"
//           value={formData.last_name}
//           onChange={handleChange}
//           placeholder="Enter your last name"
//           required
//         />
//         {errors.last_name && <p className="error-message">{errors.last_name[0]}</p>}
//       </div>

//       <div className="signup-right-form-email">
//         <label>Email address</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="Enter your email address"
//           required
//         />
//         {errors.email && <p className="error-message">{errors.email[0]}</p>}
//       </div>

//       <div className="signup-right-form-mobile">
//         <label>Mobile number</label>
//         <input
//           type="text"
//           name="mobile"
//           value={formData.mobile}
//           onChange={handleChange}
//           placeholder="Enter your mobile number"
//           required
//         />
//         {errors.mobile && <p className="error-message">{errors.mobile[0]}</p>}
//       </div>

//       <div className="signup-right-form-password" style={{ position: 'relative' }}>
//         <label>Password</label>
//         <input
//           type={showPassword ? 'text' : 'password'}
//           name="password"
//           value={password}
//           onChange={handleChange}
//           placeholder="Enter your password"
//           required
//           style={{ width: '100%', paddingRight: '40px' }}
//         />
//         <div
//           className={`password-toggle ${showPassword ? 'visible' : 'hidden'}`}
//           onClick={handleTogglePassword}
//           title={showPassword ? 'Hide password' : 'Show password'}
//         />
//         {errors.password && <p className="error-message">{errors.password}</p>}
//       </div>

//       <div className="signup-right-form-password" style={{ position: 'relative' }}>
//         <label>Confirm Password</label>
//         <input
//           type={showConfirmPassword ? 'text' : 'password'}
//           name="confirmPassword"
//           value={confirmPassword}
//           onChange={handleChange}
//           placeholder="Confirm your password"
//           required
//           style={{ width: '100%', paddingRight: '40px' }}
//         />
//         <div
//           className={`password-toggle ${showConfirmPassword ? 'visible' : 'hidden'}`}
//           onClick={handleToggleConfirmPassword}
//           title={showConfirmPassword ? 'Hide password' : 'Show password'}
//         />
//         {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
//       </div>

//       <div className="signup-right-button">
//         <button type="submit" disabled={loading}>
//           {loading ? 'Signing up...' : 'Sign Up'}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default SignupForm;
