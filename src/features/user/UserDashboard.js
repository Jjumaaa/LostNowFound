import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '../auth/authSlice';
import { fetchUserProfile, selectUser } from './userSlice';
import { fetchItems, selectItem } from '../items/itemSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import styles from '../../styles/Dashboard.module.css';
import itemCardStyles from '../../styles/ItemCard.module.css'; // For individual item cards

function UserDashboard() {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(selectAuth);
  const { profile, loading: userLoading, error: userError } = useSelector(selectUser);
  const { items, loading: itemsLoading, error: itemsError } = useSelector(selectItem);

  useEffect(() => {
    if (!profile && authUser) {
      dispatch(fetchUserProfile());
    }
    dispatch(fetchItems()); // Fetch all items for the user dashboard
  }, [dispatch, profile, authUser]);

  const recentLostItems = items
    .filter(item => item.status === 'lost')
    .sort((a, b) => new Date(b.reported_at) - new Date(a.reported_at))
    .slice(0, 5); // Show top 5 recent lost items

  const recentFoundItems = items
    .filter(item => item.status === 'found')
    .sort((a, b) => new Date(b.reported_at) - new Date(a.reported_at))
    .slice(0, 5); // Show top 5 recent found items

  if (userLoading || itemsLoading) {
    return <LoadingSpinner />;
  }

  if (userError || itemsError) {
    return <p className={styles.errorText}>Error loading dashboard data: {userError || itemsError}</p>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardHeader}>Welcome, {profile?.username || authUser?.username}!</h2>

      <section className={styles.dashboardSection}>
        <h3>Your Quick Actions</h3>
        <div className={styles.actionButtons}>
          <Link to="/report-item" className={styles.actionButton}>Report a Lost Item</Link>
          <Link to="/items" className={styles.actionButton}>Browse All Items</Link>
          <Link to="/profile" className={styles.actionButton}>Update Your Profile</Link>
          <Link to="/reward-history" className={styles.actionButton}>View Reward History</Link>
        </div>
      </section>

      <section className={styles.dashboardSection}>
        <h3>Recently Lost Items</h3>
        {recentLostItems.length === 0 ? (
          <p>No recently lost items to display.</p>
        ) : (
          <div className={styles.itemGrid}>
            {recentLostItems.map((item) => (
              <div key={item.id} className={itemCardStyles.itemCard}>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p>Status: <span className={`${itemCardStyles.status} ${itemCardStyles.statusLost}`}>{item.status}</span></p>
                <p>Location: {item.location}</p>
                <Link to={`/items/${item.id}`} className={itemCardStyles.viewDetailsButton}>View Details</Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.dashboardSection}>
        <h3>Recently Found Items</h3>
        {recentFoundItems.length === 0 ? (
          <p>No recently found items to display.</p>
        ) : (
          <div className={styles.itemGrid}>
            {recentFoundItems.map((item) => (
              <div key={item.id} className={itemCardStyles.itemCard}>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p>Status: <span className={`${itemCardStyles.status} ${itemCardStyles.statusFound}`}>{item.status}</span></p>
                <p>Location: {item.location}</p>
                <Link to={`/items/${item.id}`} className={itemCardStyles.viewDetailsButton}>View Details</Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default UserDashboard;