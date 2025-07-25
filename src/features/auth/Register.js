// src/features/auth/Register.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, selectAuth } from './authSlice';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import styles from '../../styles/Forms.module.css';

function Register() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    // Removed confirmPassword from initial state
    role: 'user', // Default role
  });
  const [loading, setLoading] = useState(false); // Local loading state
  const [error, setError] = useState(null);     // Local error state
  // Removed passwordMatchError state

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(selectAuth);

  useEffect(() => {
    // Clear local error message when component mounts or userData changes
    setError(null);
    // Removed setPasswordMatchError('')
    dispatch(clearAuthError()); // Clear any Redux-managed auth errors
  }, [userData, dispatch]);

  // Navigate if already authenticated (e.g., if token is valid on app load)
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }
  }, [isAuthenticated, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors
    // Removed setPasswordMatchError('');

    // Removed the password confirmation check:
    // if (userData.password !== userData.confirmPassword) {
    //   setPasswordMatchError('Passwords do not match');
    //   setLoading(false);
    //   return;
    // }

    try {
      console.log('Sending Registration Payload:', userData);
      const response = await fetch('https://my-repository-0z47.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role,
        }),
      });
      const data = await response.json();
      console.log('Registration Response:', response, 'Data:', data);

      if (response.ok) {
        alert('Registration successful! Please log in.');
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again. Check console for details.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {/* Removed passwordMatchError display: */}
        {/* {passwordMatchError && <p className={styles.errorMessage}>{passwordMatchError}</p>} */}

        <div className={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
            aria-label="Username"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            aria-label="Email"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
            aria-label="Password"
          />
        </div>
        {/* Removed the confirm password input field: */}
        {/* <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            required
            aria-label="Confirm Password"
          />
        </div> */}
        <div className={styles.formGroup}>
          <label htmlFor="role">Register as:</label>
          <select
            id="role"
            name="role"
            value={userData.role}
            onChange={handleChange}
            aria-label="Select Role"
          >
            <option value="user">User</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? <LoadingSpinner /> : 'Register'}
        </button>
      </form>
      <p className={styles.linkText}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;