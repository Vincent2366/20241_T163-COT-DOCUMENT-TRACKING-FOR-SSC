import React from 'react';
import styles from './FeedbackMessage.module.css'; // Create this CSS file for styling

const FeedbackMessage = ({ message, type }) => {
    if (!message) return null; // Don't render if there's no message

    return (
        <div className={`${styles.feedbackMessage} ${styles[type]}`}>
            {message}
        </div>
    );
};

export default FeedbackMessage;