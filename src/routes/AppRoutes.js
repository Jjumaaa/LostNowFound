import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../features/auth/authSlice';

// Auth Components
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';

// User Components
import UserDashboard from '../features/user/UserDashboard';
import UserProfile from '../features/user/UserProfile';
import ReportItem from '../features/items/ReportItem';
import ItemList from '../features/items/ItemList';
import ItemDetails from '../features/items/ItemDetails';
import OfferReward from '../features/rewards/OfferReward';
import RewardHistory from '../features/rewards/RewardHistory';

// Admin Components
import AdminDashboard from '../features/admin/AdminDashboard';
import ManageUsers from '../features/admin/ManageUsers';
import ManageItems from '../features/admin/ManageItems';
import ApproveClaims from '../features/admin/ApproveClaims';
import AdminRewardManagement from '../features/admin/AdminRewardManagement';

// Component for protected routes
const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useSelector(selectAuth);

  if (loading) {
    return <div>Loading authentication...</div>; // Or a proper spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />; // Redirect to an unauthorized page
  }

  return children;
};

// Unauthorized page (create this component if needed)
const Unauthorized = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2>Unauthorized Access</h2>
    <p>You do not have permission to view this page.</p>
  </div>
);

function AppRoutes() {
  const { isAuthenticated, user } = useSelector(selectAuth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Redirect based on authentication status and role */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.role === 'admin' ? (
              <Navigate to="/admin-dashboard" replace />
            ) : (
              <Navigate to="/user-dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* User Routes */}
      <Route
        path="/user-dashboard"
        element={<PrivateRoute allowedRoles={['user', 'admin']}><UserDashboard /></PrivateRoute>}
      />
      <Route
        path="/profile"
        element={<PrivateRoute allowedRoles={['user', 'admin']}><UserProfile /></PrivateRoute>}
      />
      <Route
        path="/report-item"
        element={<PrivateRoute allowedRoles={['user']}><ReportItem /></PrivateRoute>}
      />
      <Route
        path="/items"
        element={<PrivateRoute allowedRoles={['user', 'admin']}><ItemList /></PrivateRoute>}
      />
      <Route
        path="/items/:id"
        element={<PrivateRoute allowedRoles={['user', 'admin']}><ItemDetails /></PrivateRoute>}
      />
      <Route
        path="/offer-reward/:itemId"
        element={<PrivateRoute allowedRoles={['user']}><OfferReward /></PrivateRoute>}
      />
      <Route
        path="/reward-history"
        element={<PrivateRoute allowedRoles={['user', 'admin']}><RewardHistory /></PrivateRoute>}
      />

      {/* Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>}
      />
      <Route
        path="/admin/users"
        element={<PrivateRoute allowedRoles={['admin']}><ManageUsers /></PrivateRoute>}
      />
      <Route
        path="/admin/items"
        element={<PrivateRoute allowedRoles={['admin']}><ManageItems /></PrivateRoute>}
      />
      <Route
        path="/admin/claims"
        element={<PrivateRoute allowedRoles={['admin']}><ApproveClaims /></PrivateRoute>}
      />
      <Route
        path="/admin/rewards"
        element={<PrivateRoute allowedRoles={['admin']}><AdminRewardManagement /></PrivateRoute>}
      />

      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;