import styles from './ManageOrg.module.css';
import { useState, useEffect } from 'react';

export function ManageOrg() {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgData, setOrgData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/organizations', {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setOrgData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Fetch error:', error);
        setOrgData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const filteredData = searchTerm 
    ? orgData.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : orgData;

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Slice the data for the current page
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.orgSection}>
      <div className={styles.controls}>
        <input 
          type="search" 
          className={styles.searchInput} 
          placeholder="Search Organizations" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className={styles.orgTable}>
        <thead>
          <tr>
            <th>Organization ID</th>
            <th>Organization Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map(org => (
              <tr key={org._id}>
                <td>{org.organizationId}</td>
                <td>{org.name}</td>
                <td>
                  <button onClick={() => setSelectedOrg(org)}>View Details</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                No organizations found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls Below the Table */}
      <div className={styles.pagination}>
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          &lt;
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button 
            key={index + 1} 
            onClick={() => setCurrentPage(index + 1)}
            className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
          >
            {index + 1}
          </button>
        ))}
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          &gt;
        </button>
      </div>

      {/* Popup for organization details */}
      {selectedOrg && (
        <div className={styles.popup} onClick={() => setSelectedOrg(null)}>
          <div className={styles.popupContent}>
            <h2>Details for {selectedOrg.name}</h2>
            <p>ID: {selectedOrg.organizationId}</p>
            {/* Add more details as needed */}
            <button onClick={() => setSelectedOrg(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Explicit export statement
export default ManageOrg;