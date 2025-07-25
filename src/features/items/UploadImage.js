import React, { useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import formStyles from '../../styles/Forms.module.css';
import buttonStyles from '../../styles/Buttons.module.css';

function UploadImage({ onImageUpload, isLoading, uploadError }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onImageUpload(selectedFile);
      setSelectedFile(null); // Clear selected file after upload attempt
    } else {
      alert('Please select an image file to upload.');
    }
  };

  return (
    <div className={formStyles.formContainer} style={{ padding: '20px', margin: '20px 0', boxShadow: 'none', border: '1px dashed #ddd' }}>
      <h3>Add Image</h3>
      <form onSubmit={handleSubmit}>
        {uploadError && <p className={formStyles.errorMessage}>{uploadError}</p>}
        <div className={formStyles.formGroup}>
          <label htmlFor="itemImage">Choose Image:</label>
          <input
            type="file"
            id="itemImage"
            accept="image/*"
            onChange={handleFileChange}
            aria-label="Choose image file"
          />
        </div>
        <button
          type="submit"
          className={buttonStyles.primaryButton}
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? <LoadingSpinner /> : 'Upload Image'}
        </button>
      </form>
    </div>
  );
}

export default UploadImage;