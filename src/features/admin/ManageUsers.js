import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, deleteUser, selectAdmin, clearAdminError } from './adminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import styles from '../../styles/Dashboard.module.css'; // Reusing dashboard styles for list layout
import buttonStyles from '../../styles/Buttons.module.css';

function ManageUsers() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(selectAdmin);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(clearAdminError()); // Clear errors on mount
  }, [dispatch]);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
    setDeleteSuccess(false); // Reset success message
    dispatch(clearAdminError()); // Clear any previous errors
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      const resultAction = await dispatch(deleteUser(userToDelete.id));
      if (deleteUser.fulfilled.match(resultAction)) {
        setDeleteSuccess(true);
      }
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardHeader}>Manage Users</h2>

      {error && <p className={styles.errorText}>Error: {error}</p>}
      {deleteSuccess && <p className={styles.successText}>User deleted successfully!</p>}

      {users.length === 0 ? (
        <p className={styles.infoText}>No users found.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {/* Add edit functionality later if needed */}
                    <button
                      className={`${buttonStyles.dangerButton} ${buttonStyles.smallButton}`}
                      onClick={() => handleDeleteClick(user)}
                      disabled={user.role === 'admin'} // Prevent admin from deleting themselves or other admins easily
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete User"
      >
        {userToDelete && (
          <>
            <p>Are you sure you want to delete user <strong>{userToDelete.username}</strong> (ID: {userToDelete.id})?</p>
            <div className={buttonStyles.buttonGroup}>
              <button
                className={buttonStyles.dangerButton}
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : 'Yes, Delete'}
              </button>
              <button
                className={buttonStyles.secondaryButton}
                onClick={() => setIsDeleteModalOpen(false)}
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

export default ManageUsers;