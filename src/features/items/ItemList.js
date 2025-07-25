import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, selectItem } from './itemSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import styles from '../../styles/Dashboard.module.css'; // Reusing for general layout
import itemCardStyles from '../../styles/ItemCard.module.css';
import formStyles from '../../styles/Forms.module.css'; // For search input

function ItemList() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(selectItem);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'lost', 'found'

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading && items.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className={styles.errorText}>Error: {error}</p>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardHeader}>All Reported Items</h2>

      <div className={styles.filterBar}>
        <div className={formStyles.formGroup} style={{ flexGrow: 1, marginRight: '15px' }}>
          <input
            type="text"
            placeholder="Search by name, description, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={formStyles.input}
            aria-label="Search items"
          />
        </div>
        <div className={formStyles.formGroup} style={{ width: '150px' }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={formStyles.input}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
            <option value="claimed">Claimed</option>
          </select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p className={styles.infoText}>No items found matching your criteria.</p>
      ) : (
        <div className={styles.itemGrid}>
          {filteredItems.map((item) => (
            <div key={item.id} className={itemCardStyles.itemCard}>
              {item.images && item.images.length > 0 && (
                <img
                  src={item.images[0].image_url.startsWith('http') ? item.images[0].image_url : `http://127.0.0.1:10000/${item.images[0].image_url}`}
                  alt={item.name}
                />
              )}
              <h4>{item.name}</h4>
              <p>{item.description?.substring(0, 100)}{item.description?.length > 100 ? '...' : ''}</p>
              <p>Location: <strong>{item.location}</strong></p>
              <p>Status:
                <span className={`${itemCardStyles.status} ${itemCardStyles[`status${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`]}`}>
                  {item.status}
                </span>
              </p>
              <Link to={`/items/${item.id}`} className={itemCardStyles.viewDetailsButton}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemList;