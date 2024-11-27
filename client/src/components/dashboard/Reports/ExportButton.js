import React, { useState } from 'react';
import axios from 'axios';
import styles from './ExportButton.module.css';

const ExportButton = ({ organizationId }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `/api/reports/export-transactions/${organizationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.spreadsheetUrl) {
        window.open(response.data.spreadsheetUrl, '_blank');
      } else {
        throw new Error('No spreadsheet URL returned');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export transactions. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button 
      onClick={handleExport} 
      disabled={isExporting}
      className={styles.exportButton}
      title="Export to Google Sheets"
    >
      <img 
        src="https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png"
        alt="Export to Google Sheets"
        className={styles.sheetsIcon}
      />
      {isExporting && <span className={styles.loadingText}>Exporting...</span>}
    </button>
  );
};

export default ExportButton; 