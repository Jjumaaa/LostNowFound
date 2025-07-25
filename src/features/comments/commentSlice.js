import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axiosConfig';

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchComments = createAsyncThunk(
  'comment/fetchComments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/comments');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch comments');
    }
  }
);

export const createComment = createAsyncThunk(
  'comment/createComment',
  async (commentData, { rejectWithValue }) => {
    try {
      const response = await API.post('/comments', commentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create comment');
    }
  }
);

export const editComment = createAsyncThunk(
  'comment/editComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/comments/${commentId}`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to edit comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await API.delete(`/comments/${commentId}`);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete comment');
    }
  }
);

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    clearCommentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit Comment
      .addCase(editComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.map(comment =>
          comment.id === action.payload.id ? action.payload : comment
        );
      })
      .addCase(editComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(comment => comment.id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCommentError } = commentSlice.actions;

export const selectComment = (state) => state.comment;

export default commentSlice.reducer;