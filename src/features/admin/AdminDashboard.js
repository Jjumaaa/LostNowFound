// src/features/admin/AdminDashboard.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '../auth/authSlice'; // Ensure this path is correct
import { fetchAllUsers, selectAdmin } from './adminSlice';
import { fetchItems, selectItem } from '../items/itemSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import styles from '../../styles/Dashboard.module.css';

function AdminDashboard() {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(selectAuth); // authUser is now used
  const { users, loading: adminLoading, error: adminError } = useSelector(selectAdmin);
  const { items, loading: itemsLoading, error: itemsError } = useSelector(selectItem);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchItems());
  }, [dispatch]);

  const totalUsers = users.length;
  const totalItems = items.length;
  const lostItems = items.filter(item => item.status === 'lost').length;
  const foundItems = items.filter(item => item.status === 'found').length;
  const pendingClaims = items.filter(item => item.status === 'pending_claim_approval').length; // Assuming a status for pending claims

  if (adminLoading || itemsLoading) {
    return <LoadingSpinner />;
  }

  if (adminError || itemsError) {
    return <p className={styles.errorText}>Error loading dashboard data: {adminError || itemsError}</p>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardHeader}>Welcome, {authUser?.username || 'Admin'}! Admin Dashboard</h2> {/* Use authUser here */}

      <section className={styles.dashboardSection}>
        <h3>Overview</h3>
        <div className={styles.itemGrid}>
          <div className={`${styles.dashboardCard} card`}>
            <h4>Total Users</h4>
            <p className={styles.metricNumber}>{totalUsers}</p>
          </div>
          <div className={`${styles.dashboardCard} card`}>
            <h4>Total Items</h4>
            <p className={styles.metricNumber}>{totalItems}</p>
          </div>
          <div className={`${styles.dashboardCard} card`}>
            <h4>Lost Items</h4>
            <p className={styles.metricNumber}>{lostItems}</p>
          </div>
          <div className={`${styles.dashboardCard} card`}>
            <h4>Found Items</h4>
            <p className={styles.metricNumber}>{foundItems}</p>
          </div>
          <div className={`${styles.dashboardCard} card`}>
            <h4>Pending Claims</h4>
            <p className={styles.metricNumber}>{pendingClaims}</p>
          </div>
        </div>
      </section>

      <section className={styles.dashboardSection}>
        <h3>Admin Actions</h3>
        <div className={styles.actionButtons}>
          <Link to="/admin/users" className={styles.actionButton}>Manage Users</Link>
          <Link to="/admin/items" className={styles.actionButton}>Manage Items</Link>
          <Link to="/admin/claims" className={styles.actionButton}>Approve Claims</Link>
          <Link to="/admin/rewards" className={styles.actionButton}>Reward Management</Link>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;