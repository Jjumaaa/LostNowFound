import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllRewards, selectAdmin } from './adminSlice'; // Renamed from adminSlice for all rewards
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/helpers';
import styles from '../../styles/Dashboard.module.css';
import itemCardStyles from '../../styles/ItemCard.module.css'; // For status styling

function AdminRewardManagement() {
  const dispatch = useDispatch();
  const { adminRewards, loading, error } = useSelector(selectAdmin);

  useEffect(() => {
    dispatch(fetchAllRewards());
  }, [dispatch]);

  if (loading && adminRewards.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className={styles.errorText}>Error: {error}</p>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardHeader}>Reward Management</h2>

      {adminRewards.length === 0 ? (
        <p className={styles.infoText}>No rewards to display.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Reward ID</th>
                <th>Item Name</th>
                <th>Amount</th>
                <th>Offered By</th>
                <th>Received By</th>
                <th>Status</th>
                <th>Offered At</th>
                <th>Paid At</th>
              </tr>
            </thead>
            <tbody>
              {adminRewards.map((reward) => (
                <tr key={reward.id}>
                  <td>{reward.id}</td>
                  <td>{reward.item?.name || 'N/A'}</td>
                  <td>{formatCurrency(reward.amount)}</td>
                  <td>{reward.offered_by?.username || 'N/A'}</td>
                  <td>{reward.received_by?.username || 'N/A'}</td>
                  <td>
                    <span className={`${itemCardStyles.status} ${reward.status === 'paid' ? itemCardStyles.statusFound : itemCardStyles.statusLost}`}>
                      {reward.status}
                    </span>
                  </td>
                  <td>{formatDate(reward.offered_at)}</td>
                  <td>{reward.paid_at ? formatDate(reward.paid_at) : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminRewardManagement;