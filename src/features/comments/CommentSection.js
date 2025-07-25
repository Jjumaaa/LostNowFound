import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, editComment } from './commentSlice';
import { selectAuth } from '../auth/authSlice';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import styles from '../../styles/CommentSection.module.css'; // Create this CSS module
import buttonStyles from '../../styles/Buttons.module.css';
import formStyles from '../../styles/Forms.module.css';
import { formatDate } from '../../utils/helpers';

function CommentSection({ comments }) {
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);
  const { loading: commentLoading, error: commentError } = useSelector(state => state.comment);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleEditClick = (comment) => {
    setCommentToEdit(comment);
    setEditContent(comment.content);
    setIsEditModalOpen(true);
    setEditSuccess(false);
  };

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setIsDeleteModalOpen(true);
    setDeleteSuccess(false);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (commentToEdit && editContent.trim()) {
      const resultAction = await dispatch(editComment({ commentId: commentToEdit.id, content: editContent }));
      if (editComment.fulfilled.match(resultAction)) {
        setEditSuccess(true);
        setIsEditModalOpen(false);
        setCommentToEdit(null);
      }
    }
  };

  const confirmDeleteComment = async () => {
    if (commentToDelete) {
      const resultAction = await dispatch(deleteComment(commentToDelete.id));
      if (deleteComment.fulfilled.match(resultAction)) {
        setDeleteSuccess(true);
        setIsDeleteModalOpen(false);
        setCommentToDelete(null);
      }
    }
  };

  if (!comments || comments.length === 0) {
    return <p className={styles.noComments}>No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className={styles.commentsList}>
      {commentError && <p className={formStyles.errorMessage}>{commentError}</p>}
      {editSuccess && <p className={formStyles.successMessage}>Comment updated successfully!</p>}
      {deleteSuccess && <p className={formStyles.successMessage}>Comment deleted successfully!</p>}

      {comments.map((comment) => (
        <div key={comment.id} className={styles.commentCard}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>{comment.user?.username || 'Anonymous'}</span>
            <span className={styles.commentDate}>{formatDate(comment.created_at)}</span>
          </div>
          <p className={styles.commentContent}>{comment.content}</p>
          {(user && (user.id === comment.user_id || user.role === 'admin')) && (
            <div className={styles.commentActions}>
              <button
                className={`${buttonStyles.secondaryButton} ${buttonStyles.smallButton}`}
                onClick={() => handleEditClick(comment)}
                disabled={commentLoading}
              >
                Edit
              </button>
              <button
                className={`${buttonStyles.dangerButton} ${buttonStyles.smallButton}`}
                onClick={() => handleDeleteClick(comment)}
                disabled={commentLoading}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Comment"
      >
        {commentToEdit && (
          <form onSubmit={handleUpdateComment}>
            <div className={formStyles.formGroup}>
              <label htmlFor="editCommentContent">Comment:</label>
              <textarea
                id="editCommentContent"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows="4"
                required
                className={formStyles.textarea}
              ></textarea>
            </div>
            <div className={buttonStyles.buttonGroup}>
              <button type="submit" className={buttonStyles.primaryButton} disabled={commentLoading}>
                {commentLoading ? <LoadingSpinner /> : 'Save Changes'}
              </button>
              <button type="button" className={buttonStyles.secondaryButton} onClick={() => setIsEditModalOpen(false)} disabled={commentLoading}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Comment"
      >
        {commentToDelete && (
          <>
            <p>Are you sure you want to delete this comment?</p>
            <div className={buttonStyles.buttonGroup}>
              <button
                className={buttonStyles.dangerButton}
                onClick={confirmDeleteComment}
                disabled={commentLoading}
              >
                {commentLoading ? <LoadingSpinner /> : 'Yes, Delete'}
              </button>
              <button
                className={buttonStyles.secondaryButton}
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={commentLoading}
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

export default CommentSection;