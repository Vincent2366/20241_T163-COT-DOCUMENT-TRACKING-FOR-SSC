import React from 'react';
import styles from './NavigationItem.module.css';

export function NavigationItem({ icon, label, isActive, status, counts }) {
  const getBadgeCount = () => {
    if (!counts) return null;
    
    switch (status) {
      case 'pending':
        return counts.pending > 0 ? counts.pending : null;
      case 'in-transit':
        return counts.inTransit > 0 ? counts.inTransit : null;
      default:
        return null;
    }
  };

  const badgeCount = getBadgeCount();

  return (
    <button 
      className={`${styles.navItem} ${isActive ? styles.active : ''}`}
      tabIndex="0"
    >
      <img src={icon} alt="" className={styles.navIcon} />
      <span className={styles.navLabel}>{label}</span>
      {badgeCount && <span className={styles.badge}>{badgeCount}</span>}
    </button>
  );
}