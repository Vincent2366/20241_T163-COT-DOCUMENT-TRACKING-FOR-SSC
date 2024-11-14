import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TransactionHistory.module.css';
import { useNavigate } from 'react-router-dom';

export function DocumentHistory({ type }) {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userOrg, setUserOrg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage] = useState(10);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentHistory, setDocumentHistory] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/auth/me', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setUserOrg(response.data.organization);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        setError('Failed to fetch user data');
      }
    };

    getUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!userOrg) return;

      try {
        const response = await axios.get('http://localhost:2000/api/documents/all', {
          params: {
            organization: userOrg,
            status: type
          }
        });
        let filteredDocs = response.data.filter(doc => doc.recipient === userOrg);

        // Filter based on type parameter
        switch (type) {
          case 'in-transit':
            filteredDocs = filteredDocs.filter(doc => doc.status === 'in-transit');
            break;
          case 'finished':
            filteredDocs = filteredDocs.filter(doc => doc.status === 'delivered');
            break;
          case 'transferred':
            filteredDocs = filteredDocs.filter(doc => doc.status === 'rejected');
            break;
          // 'all' doesn't need filtering
        }

        setDocuments(filteredDocs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setError('Failed to fetch documents');
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [userOrg, type]);

  const getSortedData = (data) => {
    if (!data) return {
      data: [],
      totalPages: 0
    };
    
    let filteredData = data;
    
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
      default:
        break;
    }

    const totalPages = Math.ceil(filteredData.length / documentsPerPage);
    const startIndex = (currentPage - 1) * documentsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + documentsPerPage);
    
    return {
      data: paginatedData,
      totalPages: totalPages
    };
  };

  const handlePageChange = (pageNumber) => {
    // Ensure page number is within valid range
    if (pageNumber < 1 || pageNumber > getSortedData(documents).totalPages) {
      return;
    }
    setCurrentPage(pageNumber);
  };

  const handleSerialNumberClick = async (id) => {
    try {
      const response = await axios.get(`http://localhost:2000/api/documents/history/${id}`);
      setSelectedDocument(id);
      setDocumentHistory(response.data);
    } catch (error) {
      console.error('Error fetching document history:', error);
      setDocumentHistory([]);
    }
  };

  const formatHistoryDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleStatusChange = async (documentId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Accept' ? 'pending' : 'Accept';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:2000/api/documents/update-status/${documentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus,
          documentId: documentId,
          forwardedFrom: userOrg,
          description: `Status changed from ${currentStatus} to ${newStatus}`,
          remarks: 'Status update'
        })
      });

      // ... rest of the function
    } catch (error) {
      console.error('Error updating document status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  return (
    <section className={styles.historySection}>
      <header className={styles.historyHeader}>
        <h1 className={styles.historyTitle}>
          {type ? `${type.charAt(0).toUpperCase() + type.slice(1)} Documents` : 'All Documents'}
        </h1>
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f2a2d5994f3e7591026d17b75e05a400996b2106b14f2cd9dad3595ff535358b?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a" 
              alt="" 
              className={styles.searchIcon} 
            />
            <input 
              type="search" 
              className={styles.searchInput} 
              placeholder="Search" 
              aria-label="Search documents"
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
            <th>Serial Number</th>
            <th>Document Name</th>
            <th>Description</th>
            <th>Remarks</th>
            <th>Recipient</th>
            <th>Date Created</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {documents && getSortedData(documents).data.length > 0 ? (
            getSortedData(documents).data.map(doc => (
              <tr key={doc._id}>
                <td>
                  <button 
                    className={styles.serialNumber} 
                    onClick={() => handleSerialNumberClick(doc._id)}
                  >
                    {doc.serialNumber}
                  </button>
                </td>
                <td>{doc.documentName}</td>
                <td>{doc.description}</td>
                <td>{doc.remarks}</td>
                <td>{doc.recipient}</td>
                <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                <td>{doc.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                {loading ? 'Loading...' : 'No documents found'}
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

      {selectedDocument && documentHistory && (
        <div className={styles.popup} onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedDocument(null);
            setDocumentHistory(null);
          }
        }}>
          <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
              <h2>Document History</h2>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setSelectedDocument(null);
                  setDocumentHistory(null);
                }}
              >
                ×
              </button>
            </div>
            <div className={styles.historyContent}>
              {documentHistory.map((entry, index) => (
                <div key={index} className={styles.historyEntry}>
                  <div className={styles.historyHeader}>
                    <span className={styles.historyDate}>
                      {formatHistoryDate(entry.date)}
                    </span>
                    <span className={`${styles.historyAction} ${styles[entry.action.toLowerCase().replace(/\s+/g, "")]}`}>
                      {entry.action}
                    </span>
                  </div>
                  <div className={styles.historyOffice}>
                    {entry.office}
                  </div>
                  <div className={styles.historyActionDetails}>
                    {entry.details?.forwardedFrom && (
                      <div className={styles.forwardedFrom}>
                        Forwarded From: {entry.details.forwardedFrom}
                      </div>
                    )}
                    {entry.details?.description && (
                      <div>Description: {entry.details.description}</div>
                    )}
                    {entry.details?.remarks && (
                      <div>Remarks: {entry.details.remarks}</div>
                    )}
                    {entry.description && !entry.details?.description && (
                      <div>Actions Taken: {entry.description}</div>
                    )}
                  </div>
                  {entry.details?.forwardTo && (
                    <div className={styles.historyForward}>
                      Forwarded to: {entry.details.forwardTo}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 