import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './SideNavigation.module.css';
import { NavigationItem } from './NavigationItem';
import Modal from '../../Modal'; // Adjust the path as necessary
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:2000'; // or whatever port your backend is running on

const navigationItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/005c7a1fc7b800da9ed0eb7da389c028dba409099cc177f99c94e1fb260ee196?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "Dashboard", isActive: true, link: "/dashboard" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/b926edca9da2bd02e758e006f2ebaf4a5943ec2e14c0bc7043ff1638257afb48?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "New Document" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/62af66e9f4c012032bfebdb68e774d2cca1b439bb2c9f816d6066d03b5c1cafc?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "Transfer In" },
  { icon: "/images/icon.png", label: "Pending" },
];

const documentItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/5eb33c88da331cbd7c80d172ba8a5de6d7debd99be7fac7149b15af2863f8670?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "All" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/299f0b10ae60643f7737cf49c147dcc13c34aad7e5b16295767fbcbfae42acd2?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "In Transit" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/c23e99a6561a8d6f026efdd6ce16ade880ca84befe6ed8629ae672d7b96ade03?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "Finished" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/83feaa9ecdedbf3d72e64b4b4994f571d0ef35f7cef23d1c2e8aae75d542019c?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "Transferred Out" },
];

const SideNavigation = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate
  const [recipients, setRecipients] = useState([
    'SSC',
    'SBO',
    'COMSOC',
    // Add more recipients as needed
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
  });

  const handleItemClick = (label) => {
    if (label === "Dashboard") {
      navigate('/dashboard');
    } else if (label === "New Document") {
      setModalTitle("New Document");
      setModalContent("new-document");
      setModalOpen(true);
    } else {
      setModalTitle(label);
      setModalContent(label);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const documentData = {
      serialNumber: formData.get('serialNumber'),
      documentName: formData.get('documentName'),
      recipient: formData.get('recipient'),
      userId: formData.get('userId'),
      remarks: formData.get('remarks'),
      status: 'pending',
      createdAt: formData.get('createdAt') || new Date().toISOString(),
    };

    console.log('Sending document data:', documentData);

    try {
      const response = await axios.post('/api/documents/new', documentData);
      console.log('Response:', response.data);
      
      setSuccessMessage('Document created successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        closeModal();
      }, 2000);
      
      e.target.reset();
      
    } catch (err) {
      console.error('Error response:', err.response?.data);
      setError(
        err.response?.data?.message || 
        'Failed to create document. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className={styles.sideNav}>
      {navigationItems.map((item, index) => (
        <div key={index} onClick={() => handleItemClick(item.label)}>
          <NavigationItem {...item} />
        </div>
      ))}
      
      <h2 className={styles.sectionTitle}>My Documents</h2>
      {documentItems.map((item, index) => (
        <NavigationItem key={`doc-${index}`} {...item} />
      ))}
      
      
      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        {modalContent === "new-document" && (
          <form className={styles.modalContent} onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}
            {successMessage && <div className={styles.success}>{successMessage}</div>}
            <div className={styles.formGroup}>
              <label className={styles.label}>Serial Number</label>
              <input 
                name="serialNumber"
                type="text" 
                placeholder="Enter Serial Number (e.g. 24-1)" 
                className={styles.input}
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Document Name</label>
              <input 
                name="documentName"
                type="text" 
                placeholder="Enter Document Name" 
                className={styles.input}
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Recipient</label>
              <select name="recipient" className={styles.select} required>
                <option value="">Select Recipient</option>
                {recipients.map((recipient, index) => (
                  <option key={index} value={recipient}>{recipient}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>User ID</label>
              <input 
                name="userId"
                type="text" 
                placeholder="Enter User ID" 
                className={styles.input}
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Remarks</label>
              <textarea 
                name="remarks"
                placeholder="Enter remarks..." 
                className={styles.textarea}
              ></textarea>
            </div>
            
           
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Document'}
            </button>
          </form>
        )}
      </Modal>
    </nav>
  );
};

export default SideNavigation;