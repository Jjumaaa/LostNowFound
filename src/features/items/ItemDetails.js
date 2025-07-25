// src/features/items/ItemDetails.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchItemById, selectItem, uploadItemImage, clearImageUploadError } from './itemSlice'; // clearImageUploadError is now used
import { createComment, fetchComments, selectComment } from '../comments/commentSlice';
import { selectAuth } from '../auth/authSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import CommentSection from '../comments/CommentSection';
import UploadImage from './UploadImage'; // Component for image upload
import styles from '../../styles/ItemDetails.module.css'; // Create this CSS module
import itemCardStyles from '../../styles/ItemCard.module.css'; // For status styling
import formStyles from '../../styles/Forms.module.css';
import buttonStyles from '../../styles/Buttons.module.css';
import { formatDate } from '../../utils/helpers';

function ItemDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedItem, loading, error, uploadingImage, imageUploadError } = useSelector(selectItem);
  const { comments, loading: commentsLoading, error: commentsError } = useSelector(selectComment);
  const { user } = useSelector(selectAuth);

  const [commentContent, setCommentContent] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchItemById(id));
    dispatch(fetchComments()); // Fetch all comments to filter by item_id later
    // Fix: Clear image upload error when component mounts or item changes
    dispatch(clearImageUploadError());
  }, [dispatch, id]); // Added dispatch to dependencies

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    const resultAction = await dispatch(createComment({ item_id: id, content: commentContent }));
    if (createComment.fulfilled.match(resultAction)) {
      setCommentContent('');
      setCommentSuccess(true);
      // Re-fetch comments to get the latest list including the new one
      dispatch(fetchComments());
      setTimeout(() => setCommentSuccess(false), 3000);
    }
  };

  const handleImageUpload = async (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result; // This is a data URL, not a public URL for backend
        // For your Flask app, you likely need a separate endpoint for file uploads
        // which would then return a URL.
        // For now, let's assume `upload_image` takes a URL.
        // You'll need to adapt this part heavily based on your actual Flask file upload setup.
        // Example: If Flask expects a base64 string, you can send `reader.result`
        // If Flask expects a file via FormData, you'd use FormData.

        // Simulating a dummy URL for frontend display for now
        // For a real scenario:
        // const formData = new FormData();
        // formData.append('file', file);
        // const uploadResponse = await API.post('/upload', formData); // Your actual upload endpoint
        // const realImageUrl = uploadResponse.data.url;

        // For now, let's just use a placeholder or the data URL if your backend can handle it
        // OR you need to modify backend to accept base64 if that's what you send here.
        // Given your backend has an '/images' endpoint that expects `image_url`
        // we'll simulate by just passing the data URL for demonstration.
        // **IMPORTANT**: This is not how typical file uploads work with Flask.
        // You'd usually send a FormData object with the file, and Flask would save it
        // and return the public URL.
        const resultAction = await dispatch(uploadItemImage({ itemId: id, imageUrl: imageUrl })); // imageUrl should be a public URL
        if (uploadItemImage.fulfilled.match(resultAction)) {
          alert('Image uploaded successfully! (Note: Actual backend file upload logic needed)');
          // No need to re-fetch if slice updates correctly
        }
      };
      reader.readAsDataURL(file); // Reads file as base64
    }
  };

  const itemComments = comments.filter(comment => comment.item_id === parseInt(id));

  if (loading || commentsLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className={styles.errorText}>Error: {error}</p>;
  }

  if (!selectedItem) {
    return <p className={styles.infoText}>Item not found.</p>;
  }

  const isReporter = user && user.id === selectedItem.reporter_id;

  return (
    <div className={styles.itemDetailsContainer}>
      <h2 className={styles.itemTitle}>{selectedItem.name}</h2>
      <div className={styles.itemHeader}>
        <p className={styles.itemStatus}>Status:
          <span className={`${itemCardStyles.status} ${itemCardStyles[`status${selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}`]}`}>
            {selectedItem.status}
          </span>
        </p>
        <p className={styles.itemReportedBy}>Reported by: <strong>{selectedItem.reporter?.username || 'N/A'}</strong></p>
      </div>

      <div className={styles.itemContent}>
        <div className={styles.itemImageGallery}>
          {selectedItem.images && selectedItem.images.length > 0 ? (
            selectedItem.images.map((image, index) => (
              <img
                key={index}
                src={image.image_url.startsWith('http') ? image.image_url : `http://127.0.0.1:10000/${image.image_url}`}
                alt={`${selectedItem.name} ${index + 1}`} // Fix: Non-redundant alt attribute
                className={styles.itemImage}
              />
            ))
          ) : (
            <div className={styles.noImagePlaceholder}>
              No images available.
            </div>
          )}
        </div>

        <div className={styles.itemInfo}>
          <p><strong>Description:</strong> {selectedItem.description || 'No description provided.'}</p>
          <p><strong>Location:</strong> {selectedItem.location}</p>
          <p><strong>Reported At:</strong> {formatDate(selectedItem.reported_at)}</p>

          {isReporter && selectedItem.status === 'lost' && (
            <div className={styles.actionSection}>
              <Link to={`/offer-reward/${selectedItem.id}`} className={buttonStyles.primaryButton}>
                Offer Reward
              </Link>
              <p className={styles.helpText}>If your item is found, you can offer a reward.</p>
            </div>
          )}

          {user && user.role === 'admin' && (selectedItem.status === 'found' || selectedItem.status === 'lost') && (
            <div className={styles.adminActions}>
              <h4>Admin Actions:</h4>
              {/* This is a simplified claim; in a full app, claim would be initiated by a user then approved */}
              {selectedItem.status === 'found' && (
                <button
                  className={`${buttonStyles.successButton} ${buttonStyles.smallButton}`}
                  onClick={() => alert('Implement Admin Claim Logic - this should create a claim for approval')}
                >
                  Initiate Claim for Approval
                </button>
              )}
              {selectedItem.status === 'lost' && (
                <button
                  className={`${buttonStyles.primaryButton} ${buttonStyles.smallButton}`}
                  onClick={() => alert('Admin can mark this as "found" directly for desk reports')}
                >
                  Mark as Found
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      {(isReporter || user?.role === 'admin') && (
        <div className={styles.imageUploadSection}>
          <h3>Upload Image for this item</h3>
          {imageUploadError && <p className={formStyles.errorMessage}>{imageUploadError}</p>}
          <UploadImage onImageUpload={handleImageUpload} isLoading={uploadingImage} />
          <p className={styles.helpText}>Upload images to help identify the item.</p>
        </div>
      )}

      <div className={styles.commentSection}>
        <h3>Comments</h3>
        <form onSubmit={handleAddComment} className={styles.addCommentForm}>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Add a comment or ask about the item..."
            rows="3"
            required
            className={formStyles.textarea}
            aria-label="Add a comment"
          ></textarea>
          <button type="submit" className={buttonStyles.primaryButton} disabled={loading}>
            Add Comment
          </button>
        </form>
        {commentSuccess && <p className={formStyles.successMessage}>Comment added successfully!</p>}
        {commentsError && <p className={formStyles.errorMessage}>{commentsError}</p>}
        <CommentSection comments={itemComments} />
      </div>
    </div>
  );
}

export default ItemDetails;