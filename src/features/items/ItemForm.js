// src/features/items/ItemForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearItemError, selectItem } from './itemSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import formStyles from '../../styles/Forms.module.css';
import buttonStyles from '../../styles/Buttons.module.css'; // buttonStyles is now used

function ItemForm({ initialData = {}, onSubmit, submitButtonText, isLoading, isEditing = false }) {
  // Fix: useDispatch must be called at the top level of the component
  const dispatch = useDispatch();

  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [location, setLocation] = useState(initialData.location || '');
  const [status, setStatus] = useState(initialData.status || 'lost'); // Default status
  const [formError, setFormError] = useState('');

  const { error: itemError } = useSelector(selectItem); // Item specific errors from Redux

  useEffect(() => {
    setFormError(''); // Clear form error on mount or initialData change
    dispatch(clearItemError()); // Clear redux error as well
  }, [initialData, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    dispatch(clearItemError());

    if (!name || !location) {
      setFormError('Please fill in all required fields (Name, Location).');
      return;
    }

    onSubmit({ name, description, location, status });
  };

  return (
    <div className={formStyles.formContainer}>
      <h2>{isEditing ? 'Edit Item' : 'Report Lost/Found Item'}</h2>
      <form onSubmit={handleSubmit}>
        {formError && <p className={formStyles.errorMessage}>{formError}</p>}
        {itemError && <p className={formStyles.errorMessage}>{itemError}</p>}

        <div className={formStyles.formGroup}>
          <label htmlFor="name">Item Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-label="Item Name"
          />
        </div>
        <div className={formStyles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            aria-label="Item Description"
          ></textarea>
        </div>
        <div className={formStyles.formGroup}>
          <label htmlFor="location">Location (where it was lost/found):</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            aria-label="Location"
          />
        </div>
        <div className={formStyles.formGroup}>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            aria-label="Item Status"
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
            {isEditing && <option value="claimed">Claimed</option>} {/* Admin/specific users can set to claimed */}
          </select>
        </div>

        <button type="submit" className={buttonStyles.primaryButton} disabled={isLoading}> {/* buttonStyles is now used */}
          {isLoading ? <LoadingSpinner /> : submitButtonText}
        </button>
      </form>
    </div>
  );
}

export default ItemForm;