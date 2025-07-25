// src/features/rewards/RewardHistory.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRewardHistory, payReward, selectReward } from './rewardSlice';
import { selectAuth } from '../auth/authSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import styles from '../../styles/Dashboard.module.css'; // General layout
import itemCardStyles from '../../styles/ItemCard.module.css'; // For status styling
import buttonStyles from '../../styles/Buttons.module.css';
import { formatCurrency, formatDate } from '../../utils/helpers';

function RewardHistory() {
  const dispatch = useDispatch();
  const { offeredRewards, receivedRewards, loading, error } = useSelector(selectReward);
  const { user } = useSelector(selectAuth); // To check if current user is the one to receive

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [rewardToPay, setRewardToPay] = useState(null);
  const [paySuccess, setPaySuccess] = useState(false); // paySuccess is now used

  useEffect(() => {
    dispatch(fetchRewardHistory());
  }, [dispatch]);

  // Fix: Use paySuccess to display feedback
  useEffect(() => {
    if (paySuccess) {
      alert('Reward payment processed successfully!');
      // Optionally re-fetch history or update UI
      dispatch(fetchRewardHistory());
      setPaySuccess(false); // Reset after showing alert
    }
  }, [paySuccess, dispatch]);

  const handlePayClick = (reward) => {
    setRewardToPay(reward);
    setIsPayModalOpen(true);
    setPaySuccess(false); // Reset success message
  };

  const confirmPayReward = async () => {
    if (rewardToPay) {
      const resultAction = await dispatch(payReward(rewardToPay.id));
      if (payReward.fulfilled.match(resultAction)) {
        setPaySuccess(true);
      }
      setIsPayModalOpen(false);
      setRewardToPay(null);
    }
  };

  if (loading && offeredRewards.length === 0 && receivedRewards.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className={styles.errorText}>Error: {error}</p>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardHeader}>Your Reward History</h2>

      <section className={styles.dashboardSection}>
        <h3>Rewards You Offered</h3>
        {offeredRewards.length === 0 ? (
          <p className={styles.infoText}>You have not offered any rewards yet.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Offered At</th>
                  <th>Status</th>
                  <th>Received By</th>
                </tr>
              </thead>
              <tbody>
                {offeredRewards.map((reward) => (
                  <tr key={reward.id}>
                    <td>{reward.item?.name || 'N/A'}</td>
                    <td>{formatCurrency(reward.amount)}</td>
                    <td>{formatDate(reward.offered_at)}</td>
                    <td>
                      <span className={`${itemCardStyles.status} ${reward.status === 'paid' ? itemCardStyles.statusFound : itemCardStyles.statusLost}`}>
                        {reward.status}
                      </span>
                    </td>
                    <td>{reward.received_by?.username || 'Not Yet Claimed'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.dashboardSection}>
        <h3>Rewards You Received</h3>
        {receivedRewards.length === 0 ? (
          <p className={styles.infoText}>You have not received any rewards yet.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Offered By</th>
                  <th>Paid At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {receivedRewards.map((reward) => (
                  <tr key={reward.id}>
                    <td>{reward.item?.name || 'N/A'}</td>
                    <td>{formatCurrency(reward.amount)}</td>
                    <td>{reward.offered_by?.username || 'N/A'}</td>
                    <td>{reward.paid_at ? formatDate(reward.paid_at) : 'N/A'}</td>
                    <td>
                      <span className={`${itemCardStyles.status} ${reward.status === 'paid' ? itemCardStyles.statusFound : itemCardStyles.statusLost}`}>
                        {reward.status}
                      </span>
                    </td>
                    <td>
                      {reward.status === 'pending' && user && user.id === reward.received_by_id && (
                        <button
                          className={`${buttonStyles.successButton} ${buttonStyles.smallButton}`}
                          onClick={() => handlePayClick(reward)}
                          disabled={loading}
                        >
                          Mark as Paid
                        </button>
                      )}
                      {reward.status === 'paid' && <span>Paid</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Confirm Reward Payment"
      >
        {rewardToPay && (
          <>
            <p>Are you sure you want to mark the reward of <strong>{formatCurrency(rewardToPay.amount)}</strong> for item <strong>{rewardToPay.item?.name}</strong> as paid?</p>
            <div className={buttonStyles.buttonGroup}>
              <button
                className={buttonStyles.successButton}
                onClick={confirmPayReward}
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : 'Yes, Mark as Paid'}
              </button>
              <button
                className={buttonStyles.secondaryButton}
                onClick={() => setIsPayModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default RewardHistory;