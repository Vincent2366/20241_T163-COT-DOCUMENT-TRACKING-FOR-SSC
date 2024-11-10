import styles from './TransactionHistory.module.css';
import { useState, useEffect } from 'react';

export function TransactionHistory() {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentHistory, setDocumentHistory] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSerialNumberClick = async (id) => {
    try {
      const response = await fetch(`http://localhost:2000/documents/history/${id}`);
      const historyData = await response.json();
      
      setSelectedDocument(id);
      setDocumentHistory(historyData);
    } catch (error) {
      console.error('Error fetching document history:', error);
    }
  };

  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/documents/documents/all');
        const data = await response.json();
        console.log(data);
        
        setDocumentData(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
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
    
    let filteredData = data.filter(item => 
      item.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
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
    
    return {
      data: paginatedData,
      totalPages: totalPages
    };
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
            <th>Recipient</th>
            <th>Date Created</th>
            <th>Modified</th>
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
                <td>{transaction.recipient}</td>
                <td>{formatDate(transaction.createdAt)}</td>
                <td>{formatDate(transaction.modified)}</td>
                <td>
                  <span className={`${styles.status} ${styles[transaction.status.toLowerCase().replace(" ", "")]}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                No documents found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Popup for document history */}
      {selectedDocument && (
        <div className={styles.popup} onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedDocument(null);
            setDocumentHistory(null);
          }
        }}>
          <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
              <h2>Document History for {selectedDocument}</h2>
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
            {!documentHistory ? (
              <div>Loading history...</div>
            ) : documentHistory.length === 0 ? (
              <div>No history available for this document.</div>
            ) : (
              documentHistory.map((entry, index) => (
                <div key={index} className={styles.historyEntry}>
                  <h3>{entry.date}</h3>
                  <p><strong>{entry.action}</strong></p>
                  <p>{entry.description}</p>
                </div>
              ))
            )}
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
