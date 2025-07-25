// src/components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaBox, FaPlusCircle, FaGift, FaUserCog, FaClipboardList, FaCheckCircle, FaAward, FaTimes } from 'react-icons/fa';
import styles from '../styles/Sidebar.module.css';

const Sidebar = ({ isOpen, toggleSidebar, userRole }) => {
  const location = useLocation();

  const menuItems = {
    user: [
      { name: 'Dashboard', path: '/user-dashboard', icon: <FaHome /> },
      { name: 'My Profile', path: '/profile', icon: <FaUser /> },
      { name: 'Lost & Found Items', path: '/items', icon: <FaBox /> },
      { name: 'Report Item', path: '/report-item', icon: <FaPlusCircle /> },
      { name: 'Reward History', path: '/reward-history', icon: <FaGift /> },
    ],
    admin: [
      { name: 'Admin Dashboard', path: '/admin-dashboard', icon: <FaUserCog /> },
      { name: 'Manage Users', path: '/admin/users', icon: <FaUser /> },
      { name: 'Manage Items', path: '/admin/items', icon: <FaClipboardList /> },
      { name: 'Approve Claims', path: '/admin/claims', icon: <FaCheckCircle /> },
      { name: 'Reward Management', path: '/admin/rewards', icon: <FaAward /> },
      { name: 'My Profile', path: '/profile', icon: <FaUser /> },
    ]
  };

  const currentMenuItems = userRole === 'admin' ? menuItems.admin : menuItems.user;

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarTitle}>Navigation</span>
        <button onClick={toggleSidebar} className={styles.closeBtn}>
          <FaTimes />
        </button>
      </div>
      <ul className={styles.sidebarMenu}>
        {currentMenuItems.map((item, index) => (
          <li key={index} className={`${styles.menuItem} ${location.pathname === item.path ? styles.active : ''}`}>
            <Link to={item.path} onClick={toggleSidebar}>
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;