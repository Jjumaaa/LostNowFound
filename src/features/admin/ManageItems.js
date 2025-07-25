import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, updateItem, deleteItem, selectItem, clearItemError } from '../items/itemSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import ItemForm from '../items/ItemForm'; // Re-use form for editing
import styles from '../../styles/Dashboard.module.css';
import itemCardStyles from '../../styles/ItemCard.module.css';
import buttonStyles from '../../styles/Buttons.module.css';
import { formatDate } from '../../utils/helpers';

function ManageItems() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(selectItem);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchItems());
    dispatch(clearItemError());
  }, [dispatch]);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
    setUpdateSuccess(false);
    dispatch(clearItemError());
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
    setDeleteSuccess(false);
    dispatch(clearItemError());
  };

  const handleUpdateSubmit = async (formData) => {
    if (selectedItem) {
      const resultAction = await dispatch(updateItem({ id: selectedItem.id, itemData: formData }));
      if (updateItem.fulfilled.match(resultAction)) {
        setUpdateSuccess(true);
        setIsEditModalOpen(false);
        setSelectedItem(null);
        dispatch(fetchItems()); // Re-fetch items to get updated list
      }
    }
  };

  const confirmDelete = async () => {
    if (selectedItem) {
      const resultAction = await dispatch(deleteItem(selectedItem.id));
      if (deleteItem.fulfilled.match(resultAction)) {
        setDeleteSuccess(true);
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
        dispatch(fetchItems()); // Re-fetch items to get updated list
      }
    }
  };

  if (loading && items.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardHeader}>Manage Items</h2>

      {error && <p className={styles.errorText}>Error: {error}</p>}
      {deleteSuccess && <p className={styles.successText}>Item deleted successfully!</p>}
      {updateSuccess && <p className={styles.successText}>Item updated successfully!</p>}

      {items.length === 0 ? (
        <p className={styles.infoText}>No items found.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Location</th>
                <th>Reported By</th>
                <th>Reported At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.description?.substring(0, 50)}...</td>
                  <td>
                    <span className={`${itemCardStyles.status} ${itemCardStyles[`status${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.location}</td>
                  <td>{item.reporter?.username || 'N/A'}</td>
                  <td>{formatDate(item.reported_at)}</td>
                  <td>
                    <div className={itemCardStyles.itemActions}>
                      <button
                        className={`${buttonStyles.primaryButton} ${buttonStyles.smallButton}`}
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </button>
                      <button
                        className={`${buttonStyles.dangerButton} ${buttonStyles.smallButton}`}
                        onClick={() => handleDeleteClick(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Item"
      >
        {selectedItem && (
          <ItemForm
            initialData={selectedItem}
            onSubmit={handleUpdateSubmit}
            submitButtonText="Update Item"
            isLoading={loading}
            isEditing={true} // Indicate that it's an edit form
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Item"
      >
        {selectedItem && (
          <>
            <p>Are you sure you want to delete item <strong>{selectedItem.name}</strong> (ID: {selectedItem.id})?</p>
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

export default ManageItems;