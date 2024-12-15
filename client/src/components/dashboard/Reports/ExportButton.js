import React, { useState } from 'react';
import axios from 'axios';
import styles from './ExportButton.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ExportButton = ({ organizationId }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `/api/reports/export-transactions/${organizationId}?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.spreadsheetUrl) {
        window.open(response.data.spreadsheetUrl, '_blank');
        setStartDate(null);
        setEndDate(null);
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
    <div className={styles.datePickerContainer}>
      <div className={styles.datePickerWrapper}>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date "
          className={styles.datePicker}
        />
      </div>
      <div className={styles.datePickerWrapper}>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          className={styles.datePicker}
        />
      </div>
      <button 
        onClick={handleExport} 
        disabled={isExporting || !startDate || !endDate}
        className={styles.exportButton}
        title="Export to Google Sheets"
      >
        <img 
          src="https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png"
          alt="Export to Google Sheets"
          className={styles.sheetsIcon}
        />
        {isExporting ? <span className={styles.loadingText}>Exporting...</span> : <span className={styles.loadingText}>Export</span>}
      </button>
    </div>
  );
};

export default ExportButton; 