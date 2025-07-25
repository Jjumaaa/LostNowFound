import React from 'react';
// You can use a simple CSS spinner or an external library like react-spinners
// For simplicity, let's use a basic CSS spinner here.
import './LoadingSpinner.css'; // Create this CSS file

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingSpinner;