// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axiosConfig';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false, // This loading state is for general auth checks, not specific login/register now
  error: null,    // This error state is for general auth checks
};

// Async Thunks (these will NOT be used by the modified Login/Register components directly)
// They are kept here for completeness or if you decide to revert to thunks later.
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password, role }, { rejectWithValue }) => {
    try {
      const response = await API.post('/register', { username, email, password, role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await API.post('/login', { username, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }
      // Verify token by fetching user profile
      const response = await API.get('/me');
      return { user: response.data, token };
    } catch (error) {
      localStorage.removeItem('token'); // Clear invalid token
      return rejectWithValue(error.response?.data?.error || 'Authentication check failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    // New reducer to manually set authentication status after direct fetch
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
      state.loading = false;
      state.error = null;
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      } else {
        localStorage.removeItem('token');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // checkAuthStatus still uses Redux Toolkit thunk
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
      // registerUser and loginUser thunks are not handled here as they are bypassed
  },
});

export const { logout, clearAuthError, setAuth } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;