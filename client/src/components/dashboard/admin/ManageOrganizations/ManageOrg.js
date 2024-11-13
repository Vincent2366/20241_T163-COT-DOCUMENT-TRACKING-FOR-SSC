import styles from './ManageOrg.module.css';
import { useState, useEffect } from 'react';

export function ManageOrg() {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgData, setOrgData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editOrg, setEditOrg] = useState({ id: '', name: '', status: '' });

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

  const handleEdit = (org) => {
    setEditOrg({ id: org._id, name: org.name, status: org.status });
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleSave = async () => {
    console.log('Saving organization:', editOrg);
    if (!editOrg.name || !editOrg.status) {
      console.error('Name and status are required fields.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:2000/api/organizations/${editOrg.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editOrg.name,
          status: editOrg.status,
        }),
      });

      console.log('Response:', response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedData = await response.json();
      console.log('Updated organization data:', updatedData);

      setOrgData((prevData) =>
        prevData.map((org) => (org._id === updatedData._id ? updatedData : org))
      );

      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };

  const handleDelete = async (orgId) => {
    if (!window.confirm("Are you sure you want to delete this organization?")) {
      return; // Exit if the user cancels
    }
  
    try {
      const response = await fetch(`http://localhost:2000/api/organizations/${orgId}`, {
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
  
      setOrgData((prevData) => prevData.filter((org) => org._id !== orgId));
      console.log('Organization deleted successfully:', orgId);
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };
  

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
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map(org => (
              <tr key={org._id}>
                <td>{org.organizationId}</td>
                <td>{org.name}</td>
                <td>{org.status}</td>
                <td>
                  <button onClick={() => handleEdit(org)}>Edit</button>
                  <span style={{ margin: '0 8px' }}></span>
                  <button onClick={() => handleDelete(org._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className={styles.popup} onClick={handleModalClose}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <h2>Edit Organization</h2>
            <label>
              Name:
              <input
                type="text"
                value={editOrg.name}
                onChange={(e) => setEditOrg({ ...editOrg, name: e.target.value })}
              />
            </label>
            <label>
              Status:
              <select
                value={editOrg.status}
                onChange={(e) => setEditOrg({ ...editOrg, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                {/* Add more status options as needed */}
              </select>
            </label>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleModalClose}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Explicit export statement
export default ManageOrg;