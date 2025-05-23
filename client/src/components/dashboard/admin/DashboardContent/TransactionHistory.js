import styles from './TransactionHistory.module.css';
import { useState, useEffect } from 'react';

export function TransactionHistory() {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentHistory, setDocumentHistory] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSerialNumberClick = async (id) => {
    try {
      const response = await fetch(`http://localhost:2000/api/documents/history/${id}`);
      const historyData = await response.json();
      
      setSelectedDocument(id);
      setDocumentHistory(historyData);
    } catch (error) {
      console.error('Error fetching document history:', error);
      setDocumentHistory([]);
    }
  };

  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        console.log('Fetching documents...');
        const response = await fetch('http://localhost:2000/api/documents/all', {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Documents received:', data);
        setDocumentData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Fetch error:', error);
        setDocumentData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

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
    if (!data) return {
      data: [],
      totalPages: 0
    };
    
    let filteredData = searchTerm 
      ? data.filter(item => 
          (item.documentName && item.documentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.recipient && item.recipient.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.serialNumber && item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : [...data];
    
    switch (sortOption) {
      case 'newest':
        filteredData.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'oldest':
        filteredData.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      default:
        break;
    }

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    
    return {
      data: paginatedData,
      totalPages: totalPages
    };
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className={styles.historySection}>
      <header className={styles.historyHeader}>
        <h1 className={styles.historyTitle}>Transactions</h1>
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
              aria-label="Search transactions"
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
            <th>Original Sender</th>
            <th>Current Office</th>
            <th>Date Created</th>
            <th>Remarks</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {documentData && getSortedData(documentData).data.length > 0 ? (
            getSortedData(documentData).data.map(transaction => (
              <tr key={transaction._id}>
                <td>
                  <button 
                    className={styles.serialNumber} 
                    onClick={() => handleSerialNumberClick(transaction._id)}
                  >
                    {transaction.serialNumber}
                  </button>
                </td>
                <td>{transaction.documentName}</td>
                <td>{transaction.description || '-'}</td>
                <td>{transaction.originalSender || '-'}</td>
                <td>{transaction.recipient || '-'}</td>
                <td>{formatDate(transaction.createdAt)}</td>
                <td>{transaction.remarks || '-'}</td>
                <td>
                  <span className={`${styles.status} ${styles[transaction.status.toLowerCase().replace(" ", "")]}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                No documents found
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
            <div className={styles.timelineContainer}>
              {documentHistory.map((entry, index) => (
                <div key={index} className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineDate}>{formatHistoryDate(entry.date)}</div>
                    <div className={styles.timelineStatus}>{entry.action}</div>
                    {entry.details?.actionsTaken && (
                      <div className={styles.timelineDetail}>
                        <strong>Actions Taken:</strong> {entry.details.actionsTaken}
                      </div>
                    )}
                    {entry.details?.description && (
                      <div className={styles.timelineDetail}>
                        <strong>Description:</strong> {entry.details.description}
                      </div>
                    )}
                    {entry.details?.remarks && (
                      <div className={styles.timelineDetail}>
                        <strong>Remarks:</strong> {entry.details.remarks}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className={styles.pagination}>
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        > 
          &lt; 
        </button>
        
        {Array.from({ length: getSortedData(documentData).totalPages }, (_, index) => (
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
          disabled={currentPage === getSortedData(documentData).totalPages}
        > 
          &gt; 
        </button>
      </div>
    </section>
  );
}
