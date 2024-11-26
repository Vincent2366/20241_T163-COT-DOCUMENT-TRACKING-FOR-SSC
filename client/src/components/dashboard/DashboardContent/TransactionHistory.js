import styles from './TransactionHistory.module.css';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function TransactionHistory() {
  const location = useLocation();
  const filterType = location.state?.filter;

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentHistory, setDocumentHistory] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const [userOrganization, setUserOrganization] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  console.log('current filterType', filterType);
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

  const handleSerialNumberClick = async (id) => {
    try {
      const response = await fetch(`http://localhost:2000/api/documents/history/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const historyData = await response.json();
      setSelectedDocument(id);
      setDocumentHistory(historyData);
    } catch (error) {
      console.error('Error fetching document history:', error);
      // Optionally show error to user
      setDocumentHistory([]);
    }
  };

  

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        let url = 'http://localhost:2000/api/documents/all';
        
        // If filter type is 'all' and we have userOrganization, use the organization endpoint
        if (filterType === 'all' && userOrganization) {
          const encodedOrg = encodeURIComponent(userOrganization);
          url = `http://localhost:2000/api/documents/organization/${encodedOrg}`;
        }
  
        const response = await fetch(url);
        const data = await response.json();
        console.log('Fetched documents:', data);
        
        setDocumentData(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (userOrganization) {
      fetchDocument();
    }
  }, [filterType, userOrganization]);

 

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
    
    let filteredData = data;
    
    // Filter based on the type of view
    if (filterType === 'Accept') {
      // Show only accepted documents where user is recipient
      filteredData = filteredData.filter(item => 
        item.status === 'Accept' && item.recipient === userOrganization
      );
    } else if (filterType === 'pending') {
      // Show only pending documents where user is recipient
      filteredData = filteredData.filter(item => 
        item.status === 'pending' && item.recipient === userOrganization
      );
    } else if (filterType === 'all') {
      // Show all documents where the organization is either sender or recipient
      filteredData = filteredData.filter(item => 
        item.originalSender === userOrganization || 
        item.recipient === userOrganization
      );
    }
    
    // Then apply search filter
    filteredData = filteredData.filter(item => 
      item.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originalSender.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    
    return {
      data: paginatedData,
      totalPages: totalPages
    };
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
          documentId: documentId
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      // Update the local state to reflect the change
      setDocumentData(prevData => 
        prevData.map(doc => 
          doc._id === documentId ? { ...doc, status: newStatus } : doc
        )
      );
    } catch (error) {
      console.error('Error updating document status:', error);
      alert('Failed to update status. Please try again.');
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className={styles.historySection}>
      <header className={styles.historyHeader}>
        <h1 className={styles.historyTitle}>{getHeaderTitle()}</h1>
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
            <th>Remarks</th>
            <th>Sender</th>
            <th>Date</th>
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
                <td>{transaction.remarks || '-'}</td>
                <td>{transaction.originalSender || '-'}</td>
                <td>{formatDate(transaction.createdAt)}</td>
                <td>
                  <button 
                    className={transaction.status === 'Accept' ? styles.acceptButton : styles.pendingButton}
                    type="button"
                    onClick={() => handleStatusChange(transaction._id, transaction.status)}
                  >
                    {transaction.status}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
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
                  <p className={styles.historyDate}>{formatHistoryDate(entry.date)}</p>
                  <p className={styles.historyAction}>{entry.action}</p>
                  <p className={styles.historyDescription}>{entry.description}</p>
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