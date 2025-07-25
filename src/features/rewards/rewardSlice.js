import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axiosConfig';

const initialState = {
  offeredRewards: [],
  receivedRewards: [],
  loading: false,
  error: null,
};

// Async Thunks
export const offerReward = createAsyncThunk(
  'reward/offerReward',
  async (rewardData, { rejectWithValue }) => {
    try {
      const response = await API.post('/rewards', rewardData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to offer reward');
    }
  }
);

export const payReward = createAsyncThunk(
  'reward/payReward',
  async (rewardId, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/rewards/${rewardId}/pay`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to pay reward');
    }
  }
);

export const fetchRewardHistory = createAsyncThunk(
  'reward/fetchRewardHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/rewards/history');
      return response.data; // This returns { offered: [], received: [] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch reward history');
    }
  }
);

const rewardSlice = createSlice({
  name: 'reward',
  initialState,
  reducers: {
    clearRewardError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Offer Reward
      .addCase(offerReward.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(offerReward.fulfilled, (state, action) => {
        state.loading = false;
        state.offeredRewards.push(action.payload); // Add to offered rewards
      })
      .addCase(offerReward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Pay Reward
      .addCase(payReward.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payReward.fulfilled, (state, action) => {
        state.loading = false;
        state.offeredRewards = state.offeredRewards.map(reward =>
          reward.id === action.payload.id ? action.payload : reward
        );
        // Also update receivedRewards if the current user is the recipient of this paid reward
        if (action.payload.received_by_id) {
            // This is a bit tricky, ideally, if a user receives, it should appear in their received.
            // For simplicity here, we'll re-fetch history or rely on the backend sending full user objects
            // The `fetchRewardHistory` handles populating both.
        }
      })
      .addCase(payReward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Reward History
      .addCase(fetchRewardHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRewardHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.offeredRewards = action.payload.offered;
        state.receivedRewards = action.payload.received;
      })
      .addCase(fetchRewardHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRewardError } = rewardSlice.actions;

export const selectReward = (state) => state.reward;

export default rewardSlice.reducer;