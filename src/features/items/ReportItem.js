// src/features/items/ReportItem.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reportItem, selectItem, clearItemError } from './itemSlice';
import { useNavigate } from 'react-router-dom';
import ItemForm from './ItemForm'; // Reusing the form component
import formStyles from '../../styles/Forms.module.css'; // Import form styles for error message

function ReportItem() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(selectItem); // error is now used
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleSubmit = async (itemData) => {
    dispatch(clearItemError());
    setReportSuccess(false);

    const resultAction = await dispatch(reportItem(itemData));
    if (reportItem.fulfilled.match(resultAction)) {
      setReportSuccess(true);
      setTimeout(() => {
        navigate('/items'); // Redirect to items list after successful report
      }, 2000);
    }
  };

  return (
    <div>
      {reportSuccess && <p className={formStyles.successMessage}>Item reported successfully! Redirecting...</p>}
      {error && <p className={formStyles.errorMessage}>{error}</p>} {/* error is now used */}
      <ItemForm
        onSubmit={handleSubmit}
        submitButtonText="Report Item"
        isLoading={loading}
      />
    </div>
  );
}

export default ReportItem;