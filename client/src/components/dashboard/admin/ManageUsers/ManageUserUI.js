import styles from './ManageUserUI.module.css';
import { useState, useEffect } from 'react';
import FeedbackMessage from '../../../feedbackMessage';

export function ManageUserUI({ users, onDeleteUser, onUpdateUserStatus }) {  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');

  useEffect(() => {
    if (users.length > 0) {
      setLoading(false);
    }
  }, [users]);

  // Filter users based on search term and exclude admins
  const filteredData = searchTerm 
    ? users.filter(user => 
        (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         user.organization?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         user.role?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         user.status?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        user.role !== 'admin' // Exclude admin users
      )
    : users.filter(user => user.role !== 'admin'); // Exclude admin users

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const handleDelete = async (userID) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return; 
    }

    try {
      const response = await fetch(`http://localhost:2000/api/users/${userID}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      onDeleteUser(userID);
      console.log('User deleted successfully:', userID);
      setFeedbackMessage('User deleted successfully! ✅');
      setFeedbackType('success');
      setTimeout(() => setFeedbackMessage(''), 2000);
    } catch (error) {
      console.error('Error deleting user:', error);
      setFeedbackMessage('Error deleting user.');
      setFeedbackType('error');
      setTimeout(() => setFeedbackMessage(''), 3000);
    }
  };

  const toggleUserStatus = async (userID, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    // Confirmation prompt
    const confirmationMessage = currentStatus === 'active' 
        ? `Are you sure you want to Freeze this User?` 
        : `Are you sure you want to Unfreeze this User?`;

    if (!window.confirm(confirmationMessage)) {
        return; // Exit if the user cancels
    }

    // Optimistically update the UI
    onUpdateUserStatus(userID, newStatus);

    try {
        const response = await fetch(`http://localhost:2000/api/users/${userID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error details:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(`User status updated successfully: ${userID}, ${newStatus}`);
        setFeedbackMessage(`User ${newStatus === 'inactive' ? 'frozen' : 'unfrozen'} successfully! ✅`);
        setFeedbackType('success');
        setTimeout(() => setFeedbackMessage(''), 2000);
    } catch (error) {
        setFeedbackMessage('Error updating user status.');
        setFeedbackType('error');
        setTimeout(() => setFeedbackMessage(''), 3000);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <FeedbackMessage message={feedbackMessage} type={feedbackType} />

      <div className={styles.orgHeader}>
        <h1 className={styles.orgTitle}>Manage Users</h1>
        <div className={styles.controls}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search"
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
                  {user.status === 'active' ? (
                    <button
                      className={`${styles.actionButton} ${styles.toggleStatusButton}`}
                      onClick={() => toggleUserStatus(user._id, user.status)}
                    >
                      Freeze
                    </button>
                  ) : (
                    <button
                      className={`${styles.actionButton} ${styles.toggleStatusButton}`}
                      onClick={() => toggleUserStatus(user._id, user.status)}
                    >
                      Unfreeze
                    </button>
                  )}
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
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
    </div>
  );
}

export default ManageUserUI;