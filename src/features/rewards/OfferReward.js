// src/features/rewards/OfferReward.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { offerReward, clearRewardError, selectReward } from './rewardSlice';
import { fetchItemById, selectItem } from '../items/itemSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import formStyles from '../../styles/Forms.module.css';
import buttonStyles from '../../styles/Buttons.module.css'; // buttonStyles is now used
import styles from '../../styles/Dashboard.module.css'; // For general container

function OfferReward() {
  const { itemId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(selectReward);
  const { selectedItem, loading: itemLoading, error: itemError } = useSelector(selectItem);

  const [amount, setAmount] = useState('');
  const [offerSuccess, setOfferSuccess] = useState(false);

  useEffect(() => {
    if (itemId) {
      dispatch(fetchItemById(itemId));
    }
    dispatch(clearRewardError());
  }, [dispatch, itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearRewardError());
    setOfferSuccess(false);

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid positive amount for the reward.');
      return;
    }

    const rewardData = {
      item_id: parseInt(itemId),
      amount: parseFloat(amount),
    };

    const resultAction = await dispatch(offerReward(rewardData));
    if (offerReward.fulfilled.match(resultAction)) {
      setOfferSuccess(true);
      setAmount('');
      setTimeout(() => navigate('/reward-history'), 2000); // Redirect after success
    }
  };

  if (itemLoading) {
    return <LoadingSpinner />;
  }

  if (itemError) {
    return <p className={styles.errorText}>Error loading item details: {itemError}</p>;
  }

  if (!selectedItem) {
    return <p className={styles.infoText}>Item not found or could not be loaded.</p>;
  }

  return (
    <div className={formStyles.formContainer}>
      <h2>Offer Reward for: {selectedItem.name}</h2>
      <p>Description: {selectedItem.description}</p>
      <p>Location: {selectedItem.location}</p>

      <form onSubmit={handleSubmit}>
        {error && <p className={formStyles.errorMessage}>{error}</p>}
        {offerSuccess && <p className={formStyles.successMessage}>Reward offered successfully! Redirecting...</p>}

        <div className={formStyles.formGroup}>
          <label htmlFor="amount">Reward Amount (KES):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
            aria-label="Reward Amount"
          />
        </div>

        <button type="submit" className={buttonStyles.primaryButton} disabled={loading}> {/* buttonStyles is now used */}
          {loading ? <LoadingSpinner /> : 'Offer Reward'}
        </button>
      </form>
    </div>
  );
}

export default OfferReward;