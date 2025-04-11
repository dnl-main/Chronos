import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';
import Cookies from 'js-cookie';
// Set CSRF token for all axios requests
axios.defaults.baseURL = 'http://127.0.0.1:8000'; // Set your Laravel API base URL here
axios.defaults.withCredentials = true; // Ensure cookies are sent with the request

// Automatically set the CSRF token from the cookie for every request
axios.defaults.headers.common['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
