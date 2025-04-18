import styles from './ManageOrg.module.css';
import { useState, useEffect } from 'react';
import FeedbackMessage from '../../../feedbackMessage';
import ConfirmationModal from '../../../confirmationModal';

export function ManageOrg() {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgData, setOrgData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editOrg, setEditOrg] = useState({ id: '', name: '', status: '' });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState(null);
  const [modalMessage, setModalMessage] = useState('');

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
        (item.organizationId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         item.status?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : orgData;

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Slice the data for the current page
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEdit = async (org) => {
    try {
      console.log('handleEdit started for org:', org._id);
      const response = await fetch(`http://localhost:2000/api/organizations/${org._id}/lock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Log the raw response
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const textResponse = await response.text();
        console.error('Error response body:', textResponse);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Lock status response:', data);

      if (data.success) {
        console.log('Organization locked successfully, opening modal');
        setEditOrg({ 
          id: org._id, 
          name: org.name, 
          status: org.status,
          editKey: data.editKey 
        });
        setIsEditModalOpen(true);
      } else {
        setFeedbackMessage(data.message || 'Organization is currently being edited by another user');
        setFeedbackType('error');
        setTimeout(() => setFeedbackMessage(''), 3000);
      }
    } catch (error) {
      console.error("Error in handleEdit:", error);
      setFeedbackMessage('Another user is editing this Organization. Please try again.');
      setFeedbackType('error');
      setTimeout(() => setFeedbackMessage(''), 3000);
    }
  };

  const handleModalClose = () => {
    if (editOrg.id && editOrg.editKey) {
      // Release the lock when modal is closed without saving
      fetch(`http://localhost:2000/api/organizations/${editOrg.id}/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          editKey: editOrg.editKey
        })
      }).catch(error => console.error('Error releasing lock:', error));
    }
    setIsEditModalOpen(false);
    setEditOrg({ id: '', name: '', status: '' });
  };

  const handleSave = async () => {
    if (!editOrg.name || !editOrg.status) {
      setFeedbackMessage('Name and status are required fields.');
      setFeedbackType('error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:2000/api/organizations/${editOrg.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: editOrg.name,
          status: editOrg.status,
          editKey: editOrg.editKey
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

      setFeedbackMessage('Organization updated successfully! ✅');
      setFeedbackType('success');
      setTimeout(() => setFeedbackMessage(''), 2000);

      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating organization:', error);
      setFeedbackMessage('Error updating organization.');
      setFeedbackType('error');
      setTimeout(() => setFeedbackMessage(''), 3000);
    } finally {
      // Release the lock when done
      try {
        await fetch(`http://localhost:2000/api/organizations/${editOrg.id}/unlock`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            editKey: editOrg.editKey
          })
        });
      } catch (error) {
        console.error('Error releasing lock:', error);
      }
    }
  };

  const handleDelete = (orgId) => {
    setCurrentOrgId(orgId);
    setModalMessage("Are you sure you want to delete this organization?");
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentOrgId) return;

    try {
      const response = await fetch(`http://localhost:2000/api/organizations/${currentOrgId}`, {
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

      setOrgData((prevData) => prevData.filter((org) => org._id !== currentOrgId));
      console.log('Organization deleted successfully:', currentOrgId);
      setFeedbackMessage('Organization deleted successfully! ✅');
      setFeedbackType('success');
      setTimeout(() => setFeedbackMessage(''), 2000);
    } catch (error) {
      console.error('Error deleting organization:', error);
      setFeedbackMessage('Error deleting organization.');
      setFeedbackType('error');
      setTimeout(() => setFeedbackMessage(''), 3000);
    }
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.orgSection}>
      <FeedbackMessage message={feedbackMessage} type={feedbackType} />

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
                  <button 
                    className={styles.actionButton}
                    onClick={() => handleEdit(org)}
                  >
                    Edit
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDelete(org._id)}
                  >
                    Delete
                  </button>
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

      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onConfirm={confirmDelete} 
        message={modalMessage} 
      />
    </div>
  );
}

// Explicit export statement
export default ManageOrg;