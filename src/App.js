import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, checkAuthStatus } from './features/auth/authSlice';
import styles from './styles/App.module.css'; // Use CSS Modules for layout

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAuthenticated, loading: authLoading } = useSelector(selectAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus()); // Check auth status on app load
  }, [dispatch]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show a loading spinner or placeholder while checking auth status
  if (authLoading) {
    return <div className={styles.appLoading}>Loading application...</div>;
  }

  return (
    <Router>
      <div className={styles.appContainer}>
        {isAuthenticated && (
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} userRole={user?.role} />
        )}
        <div className={`${styles.mainContentWrapper} ${isSidebarOpen ? styles.sidebarShift : ''}`}>
          {isAuthenticated && <Navbar toggleSidebar={toggleSidebar} />}
          <main className={styles.content}>
            <AppRoutes />
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;