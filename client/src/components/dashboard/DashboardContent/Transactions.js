import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Transactions.module.css';
import { useLocation } from 'react-router-dom';

const Transactions = ({ organization }) => {
    const location = useLocation();
    const filterType = location.state?.filter;

    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentHistory, setDocumentHistory] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/documents/organization/${organization}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocuments(response.data);
      } catch (err) {
        setError('Failed to fetch documents');
        console.error('Error fetching documents:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (organization) {
      fetchDocuments();
    }
  }, [organization]);

  // Filter and sort data
  const getFilteredData = (data) => {
    if (!data) return { data: [], totalPages: 0 };

    let filteredData = data;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => {
        // Format the date for searching
        const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).toLowerCase();

        // Get display status for searching
        const displayStatus = item.status === 'Accept' || item.status === 'accept' ? 'IN TRANSIT' :
                            item.status === 'Pending' || item.status === 'pending' ? 'IN PROCESS' :
                            item.status;

        return (
          item.documentName.toLowerCase().includes(searchLower) ||
          item.serialNumber.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.recipient.toLowerCase().includes(searchLower) ||
          item.currentOffice.toLowerCase().includes(searchLower) ||
          displayStatus.toLowerCase().includes(searchLower) ||
          formattedDate.includes(searchLower)
        );
      });
    }

    // Apply sorting
    filteredData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return {
      data: paginatedData,
      totalPages
    };
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
  
  // Render pagination
  const renderPagination = (totalPages) => (
    <div className={styles.pagination}>
      <button 
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={currentPage === i + 1 ? styles.active : ''}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button 
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );

  const getHeaderTitle = () => {
    switch (filterType) {
      case 'Accept':
        return 'Transfer In';
      case 'pending':
        return 'Pending';
      case 'all':
        return `Transactions`;
      default:
        return 'Transfer In';
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className={styles.historySection}>
    <header className={styles.historyHeader}>
        <h1 className={styles.historyTitle}>{getHeaderTitle()}</h1>
        <div className={styles.controls}>
        <div className={styles.searchWrapper}>
            <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f2a2d5994f3e7591026d17b75e05a400996b2106b14f2cd9dad3595ff535358b" 
            alt="search" 
            className={styles.searchIcon} 
            />
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
            <span className={styles.sortLabel}>Sort by:</span>
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
    <div className={styles.transactionsContainer}>
      <table className={styles.transactionTable}>
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Document Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Recipient</th>
            <th>Created At</th>
            <th>Current Office</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredData(documents).data.length > 0 ? (
            getFilteredData(documents).data.map(doc => (
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
                <td>{doc.description || '-'}</td>
                <td>
                <span className={styles[
                    doc.status === 'Keeping the Document' ? 'done' :
                    doc.status.toLowerCase().replace(/\s+/g, '')]}>
                    {doc.status === 'Accept' ? 'IN TRANSIT' : 
                    doc.status === 'Pending' ? 'IN PROCESS' : 
                    doc.status === 'accept' ? 'IN TRANSIT' : 
                    doc.status === 'pending' ? 'IN PROCESS' :
                    doc.status === 'Keeping the Document' ? 'DONE' :
                    
                    doc.status}
                </span>
                </td>
                <td>{doc.recipient}</td>
                <td>{new Date(doc.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                //   hour: '2-digit',
                //   minute: '2-digit'
                })}</td>
                <td>{doc.currentOffice}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className={styles.noData}>
                No documents found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {renderPagination(getFilteredData(documents).totalPages)}
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
};

export default Transactions; 