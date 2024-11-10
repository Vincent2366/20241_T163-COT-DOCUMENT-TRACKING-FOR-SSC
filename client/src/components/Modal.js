import React from 'react';
import './Modal.css'; // Ensure you have the appropriate styles

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
