import React, { useState } from 'react';
import styles from './TransactionHistory.module.css';

const transactions = [
  {
    id: "00001",
    name: "Microsoft",
    recipient: "ComSoc",
    date: "1/03/2023",
    modified: "2 hours ago",
    status: "Pending"
  },
  {
    id: "00002",
    name: "Yahoo",
    recipient: "Matigda",
    date: "1/03/2023",
    modified: "a week ago",
    status: "In Transit"
  },
  {
    id: "00003",
    name: "Adobe",
    recipient: "SBO",
    date: "1/03/2023",
    modified: "15 minutes ago",
    status: "Inactive"
  },
  {
    id: "00004",
    name: "Tesla",
    recipient: "SBO",
    date: "1/03/2023",
    modified: "a week ago",
    status: "Pending"
  },
  {
    id: "00005",
    name: "Google",
    recipient: "(629) 555-0129",
    date: "jerome@google.com",
    modified: "Réunion",
    status: "Active"
  },
  {
    id: "00006",
    name: "Microsoft",
    recipient: "ComSoc",
    date: "1/03/2023",
    modified: "2 hours ago",
    status: "Active"
  },
  // ... more transactions
];

const documentHistories = {
  "00001": [
    { date: "Dec 12", action: "Received at Matigda", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ullamcorper ullamcorper quis." },
    { date: "Dec 15", action: "Processed for delivery", description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
    { date: "Dec 18", action: "Shipped to recipient", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    { date: "Dec 20", action: "Delivered to recipient", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ullamcorper ullamcorper quis." },
  ],
  "00002": [
    { date: "Nov 18", action: "Transferred out from Matigda", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus hac at mattis egestas." },
  ],
  "00003": [
    { date: "Oct 20", action: "Received at SBO", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ullamcorper ullamcorper quis." },
    { date: "Oct 22", action: "Processed for delivery", description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
    { date: "Oct 25", action: "Shipped to recipient", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    { date: "Oct 27", action: "Delivered to recipient", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ullamcorper ullamcorper quis." },
  ],
  "00004": [
    { date: "Sep 15", action: "Transferred out from SBO", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus hac at mattis egestas." },
  ],
  "00005": [
    { date: "Aug 10", action: "Received at Réunion", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ullamcorper ullamcorper quis." },
    { date: "Aug 12", action: "Processed for delivery", description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
    { date: "Aug 15", action: "Shipped to recipient", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    { date: "Aug 17", action: "Delivered to recipient", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ullamcorper ullamcorper quis." },
  ],
  "00006": [
    { date: "Jul 5", action: "Received at ComSoc", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ullamcorper ullamcorper quis." },
    { date: "Jul 7", action: "Processed for delivery", description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
    { date: "Jul 10", action: "Shipped to recipient", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    { date: "Jul 12", action: "Delivered to recipient", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ullamcorper ullamcorper quis." },
  ],
  // Add more document histories as needed
};

export function TransactionHistory() {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentHistory, setDocumentHistory] = useState(null);

  const handleSerialNumberClick = (id) => {
    setSelectedDocument(id); // Set the selected document ID
    setDocumentHistory(documentHistories[id]); // Set the history for the selected document
  };

  return (
    <section className={styles.historySection}>
      <header className={styles.historyHeader}>
        <h1 className={styles.historyTitle}>History</h1>
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/f2a2d5994f3e7591026d17b75e05a400996b2106b14f2cd9dad3595ff535358b?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a" alt="" className={styles.searchIcon} />
            <input type="search" className={styles.searchInput} placeholder="Search" aria-label="Search transactions" />
          </div>
          <div className={styles.sortWrapper}>
            <span className={styles.sortLabel}>Sort by: </span>
            <select className={styles.sortValue}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="alphabetical">Alphabetical</option>
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
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>
                <button 
                  className={styles.serialNumber} 
                  onClick={() => handleSerialNumberClick(transaction.id)}
                >
                  {transaction.id}
                </button>
              </td>
              <td>{transaction.name}</td>
              <td>{transaction.recipient}</td>
              <td>{transaction.date}</td>
              <td>{transaction.modified}</td>
              <td>
                <span className={`${styles.status} ${styles[transaction.status.toLowerCase().replace(" ", "")]}`}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Popup for document history */}
      {selectedDocument && (
        <div className={styles.popup} onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedDocument(null);
          }
        }}>
          <div className={styles.popupContent}>
            <h2>Document History for {selectedDocument}</h2>
            {documentHistory.map((entry, index) => (
              <div key={index} className={styles.historyEntry}>
                <h3>{entry.date}</h3>
                <p><strong>{entry.action}</strong></p>
                <p>{entry.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={styles.pagination}>
        <button> &lt; </button>
        <button className={styles.active}>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button> &gt; </button>
      </div>
    </section>
  );
}
