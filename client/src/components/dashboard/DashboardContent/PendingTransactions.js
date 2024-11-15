import styles from './TransactionHistory.module.css';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function PendingTransactions() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [userOrganization, setUserOrganization] = useState(null);
  const itemsPerPage = 10;
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [forwardTo, setForwardTo] = useState('');
  const [remarks, setRemarks] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [isKeepingModalOpen, setIsKeepingModalOpen] = useState(false);
  const [keepingRemarks, setKeepingRemarks] = useState('');
  const [routePurpose, setRoutePurpose] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:2000/api/auth/user-details', {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch user details');
        const userData = await response.json();
        setUserOrganization(userData.organization);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:2000/api/documents/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setDocuments(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:2000/api/organizations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setOrganizations(data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    fetchOrganizations();
  }, []);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return '-';
    }
  };

  const getSortedData = (data) => {
    if (!data) return { data: [], totalPages: 0 };
    
    let filteredData = data;
    
    // Filter by organization and pending status
    filteredData = filteredData.filter(item => 
      (userOrganization === 'admin' ? true : item.recipient === userOrganization) &&
      item.status === 'pending'
    );
    
    // Apply search filter
    filteredData = filteredData.filter(item => 
      item.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.remarks || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filteredData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
    }

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    
    return { data: paginatedData, totalPages };
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusChange = async (documentId, newStatus) => {
    if (newStatus === 'Keeping the Document') {
      setSelectedDocument(documents.find(doc => doc._id === documentId));
      setIsKeepingModalOpen(true);
      setShowStatusDropdown(null);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:2000/api/documents/update-status/${documentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedDocument = await response.json();
        setDocuments(prevDocuments => 
          prevDocuments.map(doc => 
            doc._id === documentId ? updatedDocument : doc
          )
        );
        setShowStatusDropdown(null);
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating document status:', error);
    }
  };

  const handleForwardDocument = (doc) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
    setShowStatusDropdown(null);
  };

  const handleForwardSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const documentCopy = e.target.querySelector('[name="documentCopy"]').value;
      
      const response = await fetch(`http://localhost:2000/api/documents/forward/${selectedDocument._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: 'Accept',
          forwardTo: forwardTo,
          remarks: remarks,
          documentCopy: documentCopy,
          routePurpose: routePurpose,
          forwardedBy: userOrganization,
          forwardedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        const updatedDocument = await response.json();
        setDocuments(prevDocuments => 
          prevDocuments.map(doc => 
            doc._id === selectedDocument._id ? updatedDocument : doc
          )
        );
        setIsModalOpen(false);
        setForwardTo('');
        setRemarks('');
        setRoutePurpose('');
        setSelectedDocument(null);
      }
    } catch (error) {
      console.error('Error forwarding document:', error);
    }
  };

  const handleKeepingSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:2000/api/documents/update-status/${selectedDocument._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: 'Keeping the Document',
          remarks: keepingRemarks,
          updatedAt: new Date()
        })
      });

      if (response.ok) {
        const updatedDocument = await response.json();
        setDocuments(prevDocuments => 
          prevDocuments.map(doc => 
            doc._id === selectedDocument._id ? updatedDocument : doc
          )
        );
        
        // Reset form and close modal
        setIsKeepingModalOpen(false);
        setKeepingRemarks('');
        setSelectedDocument(null);
        
        // Optional: Show success message
        alert('Document status updated successfully');
      } else {
        throw new Error('Failed to update document status');
      }
    } catch (error) {
      console.error('Error updating document status:', error);
      alert('Failed to update document status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className={styles.historySection}>
      <header className={styles.historyHeader}>
        <h1 className={styles.historyTitle}>Pending Transactions</h1>
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <input 
              type="search" 
              className={styles.searchInput} 
              placeholder="Search" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className={styles.sortWrapper}>
            <span className={styles.sortLabel}>Sort by: </span>
            <select 
              className={styles.sortValue}
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </header>

      <table className={styles.transactionTable}>
        <thead>
          <tr>
            <th>Serial Numbers</th>
            <th>Document Name</th>
            <th>Description</th>
            <th>Remarks</th>
            <th>Sender</th>
            <th>Date Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {getSortedData(documents).data.length > 0 ? (
            getSortedData(documents).data.map(doc => (
              <tr key={doc._id}>
                <td>{doc.serialNumber}</td>
                <td>{doc.documentName}</td>
                <td>{doc.description || '-'}</td>
                <td>{doc.remarks || '-'}</td>
                <td>{doc.originalSender || '-'}</td>
                <td>{formatDate(doc.createdAt)}</td>
                <td>
                  <div className={styles.statusDropdownContainer}>
                    <button 
                      className={`${styles.statusButton} ${styles[doc.status.toLowerCase()]}`}
                      onClick={() => setShowStatusDropdown(showStatusDropdown === doc._id ? null : doc._id)}
                      type="button"
                    >
                      {doc.status}
                      <span className={styles.dropdownArrow}>▼</span>
                    </button>
                    {showStatusDropdown === doc._id && (
                      <div className={styles.statusDropdown}>
                        <button onClick={() => handleForwardDocument(doc)}>Forward Document</button>
                        <button onClick={() => handleStatusChange(doc._id, 'Keeping the Document')}>Keeping the Document</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                No pending documents found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        > 
          &lt; 
        </button>
        
        {Array.from({ length: getSortedData(documents).totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? styles.active : ''}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === getSortedData(documents).totalPages}
        > 
          &gt; 
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.popupHeader}>
              <h2>Forward Document</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleForwardSubmit}>
              <div className={styles.formGroup}>
                <label>Tracking:</label>
                <input
                  type="text"
                  value={selectedDocument?.serialNumber || ''}
                  readOnly
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Details:</label>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Username:</span>
                    <span className={styles.detailValue}>{selectedDocument?.userId || '-'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Organization:</span>
                    <span className={styles.detailValue}>{selectedDocument?.recipient || '-'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Doc Name:</span>
                    <span className={styles.detailValue}>{selectedDocument?.documentName || '-'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Description:</span>
                    <span className={styles.detailValue}>{selectedDocument?.description || '-'}</span>
                  </div>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Action Taken:</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  required
                  className={styles.textarea}
                  rows={3}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Document Copy:</label>
                <select name="documentCopy" className={styles.select} required>
                  <option value="">-- Select --</option>
                  <option value="original">Original</option>
                  <option value="copy">Copy</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Route To:</label>
                <select 
                  value={forwardTo}
                  onChange={(e) => setForwardTo(e.target.value)}
                  className={styles.select}
                  required
                >
                  <option value="">-- Select Section --</option>
                  <optgroup label="USG/Institutional">
                  {organizations
                    .filter(org => org.type === 'USG/Institutional')
                    .map((org) => (
                      <option key={org._id} value={org.name}>{org.name}</option>
                    ))}
                </optgroup>
                  <optgroup label="Academic Organizations">
                    {organizations
                      .filter(org => org.type === 'ACADEMIC')
                      .map((org) => (
                        <option key={org._id} value={org.name}>{org.name}</option>
                      ))}
                  </optgroup>
                  <optgroup label="Civic Organizations">
                    {organizations
                      .filter(org => org.type === 'CIVIC')
                      .map((org) => (
                        <option key={org._id} value={org.name}>{org.name}</option>
                      ))}
                  </optgroup>
                  <optgroup label="Religious Organizations">
                    {organizations
                      .filter(org => org.type === 'RELIGIOUS')
                      .map((org) => (
                        <option key={org._id} value={org.name}>{org.name}</option>
                      ))}
                  </optgroup>
                  <optgroup label="Fraternity and Sorority">
                  {organizations
                    .filter(org => org.type === 'FRATERNITY AND SORORITY')
                    .map((org) => (
                      <option key={org._id} value={org.name}>{org.name}</option>
                    ))}
                </optgroup>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Route Purpose:</label>
                <textarea
                  value={routePurpose}
                  onChange={(e) => setRoutePurpose(e.target.value)}
                  className={styles.textarea}
                  rows={3}
                  required
                />
              </div>
              <div className={styles.modalButtons}>
                <button 
                  type="submit"
                  className={styles.submitButton}
                >
                  Forward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isKeepingModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.popupHeader}>
              <h2>Keeping the Document</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setIsKeepingModalOpen(false)}
              >
                ×
              </button>
            </div>
            <p className={styles.keepingMessage}>
              There is no need to route or forward this document. I will keep the file.
            </p>
            <form onSubmit={handleKeepingSubmit}>
              <div className={styles.formGroup}>
                <label>Actions Taken:</label>
                <textarea
                  value={keepingRemarks}
                  onChange={(e) => setKeepingRemarks(e.target.value)}
                  required
                  className={styles.textarea}
                  rows={3}
                />
              </div>
              <p className={styles.confirmMessage}>
                Are sure that there is no need to forward this document to other section?
              </p>
              <div className={styles.modalButtons}>
                <button 
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsKeepingModalOpen(false)}
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className={styles.submitButton}
                >
                  YES, I / We will keep this document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}