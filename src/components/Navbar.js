import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import styles from '../styles/Navbar.module.css';

const Navbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(selectAuth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <button onClick={toggleSidebar} className={styles.sidebarToggle}>
          <FaBars />
        </button>
        <Link to={user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} className={styles.brand}>
          Moringa Lost & Found
        </Link>
      </div>
      <div className={styles.navbarRight}>
        {user && (
          <div className={styles.userInfo}>
            <FaUserCircle className={styles.userIcon} />
            <span>Hello, {user.username} ({user.role})</span>
          </div>
        )}
        <button onClick={handleLogout} className={styles.logoutButton}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;