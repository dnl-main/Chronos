// export const validatePassword = (password, confirmPassword, email = '') => {
//   const errors = {};

//   const rules = [
//     { test: password.length >= 8, message: 'Must be at least 8 characters.' },
//     { test: /[A-Z]/.test(password), message: 'Include an uppercase letter.' },
//     { test: /[a-z]/.test(password), message: 'Include a lowercase letter.' },
//     { test: /[0-9]/.test(password), message: 'Include a number.' },
//     { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), message: 'Include a special character.' },
//     { test: !/\s/.test(password), message: 'No spaces allowed.' },
//     { test: !email || password.toLowerCase() !== email.toLowerCase(), message: 'Should not match email.' }
//   ];

//   const failed = rules.filter(rule => !rule.test).map(rule => rule.message);
//   if (failed.length > 0) errors.password = failed.join(' ');
//   if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';

//   return errors;
// };

// export const validateForm = (formData, password, confirmPassword) => {
//   const errors = {};
//   if (!formData.first_name.trim()) errors.first_name = ['First name is required.'];
//   if (!formData.last_name.trim()) errors.last_name = ['Last name is required.'];

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!formData.email) errors.email = ['Email is required.'];
//   else if (!emailRegex.test(formData.email)) errors.email = ['Invalid email format.'];

//   if (!formData.mobile) errors.mobile = ['Mobile number is required.'];
//   else if (!/^\d{10,15}$/.test(formData.mobile)) errors.mobile = ['Invalid mobile number.'];

//   const passwordErrors = validatePassword(password, confirmPassword, formData.email);
//   return { ...errors, ...passwordErrors };
// };
