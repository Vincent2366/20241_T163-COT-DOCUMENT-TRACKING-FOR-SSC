import React from 'react';
import styles from './confirmationModal.module.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Confirmation</h2>
        <p>{message}</p>
        <div className={styles.buttonContainer}>
          <button onClick={onConfirm} className={styles.confirmButton}>OK</button>
          <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;