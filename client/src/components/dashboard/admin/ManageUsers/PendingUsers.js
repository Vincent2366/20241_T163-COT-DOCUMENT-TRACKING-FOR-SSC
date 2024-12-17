import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../../../confirmationModal';
import FeedbackMessage from '../../../feedbackMessage';
import styles from './ManageUserUI.module.css';

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch('http://localhost:2000/api/users/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      const pendingUsers = data.filter(user => user.status === 'pending');
      setPendingUsers(pendingUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (userId) => {
    setCurrentUserId(userId);
    setModalMessage("Are you sure you want to approve this user?");
    setIsModalOpen(true);
  };

  const confirmApproval = async () => {
    try {
      const response = await fetch(`http://localhost:2000/api/users/approve/${currentUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve user');
      }

      setFeedbackMessage('User approved successfully! ✅');
      setFeedbackType('success');
      
      setTimeout(() => {setFeedbackMessage('');}, 3000);

      await fetchPendingUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      setFeedbackMessage('Error approving user.');
      setFeedbackType('error');
      setTimeout(() => {setFeedbackMessage('');}, 3000);
      
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const filteredData = searchTerm
    ? pendingUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : pendingUsers;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <FeedbackMessage message={feedbackMessage} type={feedbackType} />

      <div className={styles.orgHeader}>
        <h1 className={styles.orgTitle}>Pending User Approvals</h1>
        <div className={styles.controls}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className={styles.orgTable}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Organization</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.organization}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <div className={styles.actionButtons}>
                  <button 
                    className={`${styles.actionButton}`}
                    onClick={() => handleApprove(user._id)}
                  >
                    Approve
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button 
          className={styles.pageButton} 
          onClick={handlePreviousPage} 
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button 
          className={styles.pageButton} 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>

      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        onConfirm={confirmApproval} 
        message={modalMessage} 
      />
    </div>
  );
};

export default PendingUsers;
