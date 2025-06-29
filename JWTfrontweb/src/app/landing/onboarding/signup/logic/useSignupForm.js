// import { useState } from 'react';
// import axios from 'axios';
// import { validateForm } from '../logic/signupValidator';

// const useSignupForm = (navigate) => {
//   const apiUrl = import.meta.env.VITE_API_BASE_URL;
//   const [formData, setFormData] = useState({
//     first_name: '', middle_name: '', last_name: '', email: '', mobile: '', password: ''
//   });
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let sanitized = value;

//     if (['first_name', 'middle_name', 'last_name'].includes(name)) {
//       sanitized = value.replace(/[^a-zA-Z\s\-]/g, '');
//     } else if (name === 'mobile') {
//       sanitized = value.replace(/\D/g, '');
//     } else if (name === 'email') {
//       sanitized = value.toLowerCase();
//     }

//     if (name === 'password') setPassword(sanitized);
//     else if (name === 'confirmPassword') setConfirmPassword(sanitized);
//     else setFormData(prev => ({ ...prev, [name]: sanitized }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrors({});

//     const validationErrors = validateForm(formData, password, confirmPassword);
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       setLoading(false);
//       return;
//     }

//     const role = formData.email.endsWith('@friendmar.com.ph') ? 'admin' : 'user';
//     const dataToSend = {
//       ...formData,
//       middle_name: formData.middle_name.trim() || null,
//       password,
//       role
//     };

//     try {
//       await axios.post(`${apiUrl}/signup`, dataToSend);
//       alert('Signup Successful!');
//       navigate('/login');
//     } catch (error) {
//       if (error.response?.status === 422) {
//         setErrors(error.response.data.errors);
//       } else {
//         alert(error.response?.data?.message || 'Something went wrong!');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     formData,
//     password,
//     confirmPassword,
//     errors,
//     loading,
//     showPassword,
//     showConfirmPassword,
//     handleChange,
//     handleSubmit,
//     handleTogglePassword: () => setShowPassword(prev => !prev),
//     handleToggleConfirmPassword: () => setShowConfirmPassword(prev => !prev),
//   };
// };

// export default useSignupForm;
