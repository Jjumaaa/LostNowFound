import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import itemReducer from '../features/items/itemSlice';
import commentReducer from '../features/comments/commentSlice';
import rewardReducer from '../features/rewards/rewardSlice';
import adminReducer from '../features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    item: itemReducer,
    comment: commentReducer,
    reward: rewardReducer,
    admin: adminReducer,
  },
  // You can add middleware here if needed
});