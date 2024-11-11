import styles from './ManageUserUI.module.css';
import { useState, useEffect } from 'react';

export function ManageUserUI({ users }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  useEffect(() => {
    if (users.length > 0) {
      setLoading(false);
    }
  }, [users]);

  const filteredData = searchTerm 
    ? users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Slice the data for the current page
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

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.orgHeader}>
        <h1 className={styles.orgTitle}>Manage Users</h1>
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