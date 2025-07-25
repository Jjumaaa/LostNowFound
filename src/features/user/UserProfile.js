import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile, selectUser, clearUserError } from './userSlice';
import { selectAuth } from '../auth/authSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import styles from '../../styles/UserProfile.module.css';
import formStyles from '../../styles/Forms.module.css';
import buttonStyles from '../../styles/Buttons.module.css';

function UserProfile() {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(selectUser);
  const { user: authUser } = useSelector(selectAuth); // Get user from auth slice for initial values

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setEmail(profile.email || '');
    } else if (authUser) { // Fallback to authUser if profile not yet loaded
      setUsername(authUser.username || '');
      setEmail(authUser.email || '');
    }
  }, [profile, authUser]);

  useEffect(() => {
    dispatch(clearUserError());
    setPasswordError('');
    setUpdateSuccess(false);
  }, [editMode, dispatch]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setUpdateSuccess(false);
    dispatch(clearUserError());

    const updateData = {};
    if (username !== profile?.username) updateData.username = username;
    if (email !== profile?.email) updateData.email = email;

    if (newPassword) {
      if (newPassword !== confirmNewPassword) {
        setPasswordError('New passwords do not match');
        return;
      }
      updateData.password = newPassword;
    }

    if (Object.keys(updateData).length === 0) {
      alert('No changes to save.');
      setEditMode(false);
      return;
    }

    const resultAction = await dispatch(updateUserProfile(updateData));
    if (updateUserProfile.fulfilled.match(resultAction)) {
      setUpdateSuccess(true);
      setEditMode(false);
      setNewPassword('');
      setConfirmNewPassword('');
      // Re-fetch profile to ensure authUser data is also refreshed via checkAuthStatus
      dispatch(fetchUserProfile());
    }
  };

  if (loading && !profile) { // Show spinner only when initially loading profile
    return <LoadingSpinner />;
  }

  if (error && !profile) { // Show error if initial fetch failed
    return <p className={styles.errorText}>Error: {error}</p>;
  }

  if (!profile) {
    return <p className={styles.infoText}>No profile data available. Please log in.</p>;
  }

  return (
    <div className={styles.profileContainer}>
      <h2>My Profile</h2>
      {updateSuccess && <p className={formStyles.successMessage}>Profile updated successfully!</p>}
      {error && <p className={formStyles.errorMessage}>{error}</p>}
      {passwordError && <p className={formStyles.errorMessage}>{passwordError}</p>}

      {!editMode ? (
        <div className={styles.profileDetails}>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <button className={buttonStyles.primaryButton} onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className={formStyles.form}>
          <div className={formStyles.formGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              aria-label="Username"
            />
          </div>
          <div className={formStyles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
            />
          </div>
          <div className={formStyles.formGroup}>
            <label htmlFor="newPassword">New Password (optional):</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              aria-label="New Password"
            />
          </div>
          <div className={formStyles.formGroup}>
            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              aria-label="Confirm New Password"
            />
          </div>
          <div className={buttonStyles.buttonGroup}>
            <button type="submit" className={buttonStyles.primaryButton} disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Save Changes'}
            </button>
            <button type="button" className={buttonStyles.secondaryButton} onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UserProfile;