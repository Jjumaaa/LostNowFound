import axios from 'axios';

const API = axios.create({
  baseURL: 'https://my-repository-0z47.onrender.com', // Replace with your Flask backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 errors globally (e.g., token expired)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized - Token might be invalid or expired. Logging out.");
      localStorage.removeItem('token');
      // Optionally dispatch a logout action here if you have one
      // store.dispatch(logout()); // Assuming 'store' is imported or accessible
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default API;