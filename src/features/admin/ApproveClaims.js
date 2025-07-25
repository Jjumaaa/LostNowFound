import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllClaims, approveClaim, selectAdmin, clearAdminError } from './adminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import styles from '../../styles/Dashboard.module.css';
import buttonStyles from '../../styles/Buttons.module.css';
import { formatDate } from '../../utils/helpers';

function ApproveClaims() {
  const dispatch = useDispatch();
  const { claims, loading, error } = useSelector(selectAdmin);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [claimToApprove, setClaimToApprove] = useState(null);
  const [approveSuccess, setApproveSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchAllClaims());
    dispatch(clearAdminError());
  }, [dispatch]);

  const handleApproveClick = (claim) => {
    setClaimToApprove(claim);
    setIsApproveModalOpen(true);
    setApproveSuccess(false);
    dispatch(clearAdminError());
  };

  const confirmApprove = async () => {
    if (claimToApprove) {
      const resultAction = await dispatch(approveClaim(claimToApprove.id));
      if (approveClaim.fulfilled.match(resultAction)) {
        setApproveSuccess(true);
      }
      setIsApproveModalOpen(false);
      setClaimToApprove(null);
    }
  };

  const pendingClaims = claims.filter(claim => claim.status === 'pending'); // Assuming 'pending' status for new claims

  if (loading && claims.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardHeader}>Approve Item Claims</h2>

      {error && <p className={styles.errorText}>Error: {error}</p>}
      {approveSuccess && <p className={styles.successText}>Claim approved successfully!</p>}

      {pendingClaims.length === 0 ? (
        <p className={styles.infoText}>No pending claims to approve.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Item Name</th>
                <th>Claimant</th>
                <th>Claimed At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingClaims.map((claim) => (
                <tr key={claim.id}>
                  <td>{claim.id}</td>
                  <td>{claim.item?.name || 'N/A'}</td>
                  <td>{claim.claimant?.username || 'N/A'}</td>
                  <td>{formatDate(claim.claimed_at)}</td>
                  <td>{claim.status}</td>
                  <td>
                    <button
                      className={`${buttonStyles.successButton} ${buttonStyles.smallButton}`}
                      onClick={() => handleApproveClick(claim)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Confirm Claim Approval"
      >
        {claimToApprove && (
          <>
            <p>Are you sure you want to approve the claim for item <strong>{claimToApprove.item?.name}</strong> by <strong>{claimToApprove.claimant?.username}</strong>?</p>
            <div className={buttonStyles.buttonGroup}>
              <button
                className={buttonStyles.successButton}
                onClick={confirmApprove}
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : 'Yes, Approve'}
              </button>
              <button
                className={buttonStyles.secondaryButton}
                onClick={() => setIsApproveModalOpen(false)}
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

export default ApproveClaims;