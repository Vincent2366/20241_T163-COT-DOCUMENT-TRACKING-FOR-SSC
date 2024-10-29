import React from 'react';
import styles from './NavigationItem.module.css';

export function NavigationItem({ icon, label, isActive }) {
  return (
    <button 
      className={`${styles.navItem} ${isActive ? styles.active : ''}`}
      tabIndex="0"
    >
      <img src={icon} alt="" className={styles.navIcon} />
      <span className={styles.navLabel}>{label}</span>
    </button>
  );
}