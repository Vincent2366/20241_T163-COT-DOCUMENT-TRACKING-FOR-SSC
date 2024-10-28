import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './SideNavigation.module.css';
import { NavigationItem } from './NavigationItem';
import Modal from '../../Modal'; // Adjust the path as necessary

const navigationItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/005c7a1fc7b800da9ed0eb7da389c028dba409099cc177f99c94e1fb260ee196?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "Dashboard", isActive: true, link: "/dashboard" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/b926edca9da2bd02e758e006f2ebaf4a5943ec2e14c0bc7043ff1638257afb48?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "New Document" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/62af66e9f4c012032bfebdb68e774d2cca1b439bb2c9f816d6066d03b5c1cafc?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "Transfer In" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/4eb8849ea926bf25c860065d3e79a63b28b18b1c0af27d925504e2538aa4471b?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "Transfer Out" },
];

const documentItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/5eb33c88da331cbd7c80d172ba8a5de6d7debd99be7fac7149b15af2863f8670?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "All" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/299f0b10ae60643f7737cf49c147dcc13c34aad7e5b16295767fbcbfae42acd2?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "In Transit" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/c23e99a6561a8d6f026efdd6ce16ade880ca84befe6ed8629ae672d7b96ade03?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "Finished" },
];

const transactionItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/2b3c073a352329613670f0bd837641b9a273596f92e97a5493d4f54d6fddbf81?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "Transferred In" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/83feaa9ecdedbf3d72e64b4b4994f571d0ef35f7cef23d1c2e8aae75d542019c?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "Transferred Out" },
];

const manageItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ef14105a500b66854f89c5620f3d32e2a5dbaf09c38aedabb17f4c76b9ab15f4?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "New User Approval" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fdf6a3c79bdaad8ecf0558b37a861092b45999045f1f0e63787a112b3c20be64?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "Manage Users" },
];

const SideNavigation = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate
  const [recipients, setRecipients] = useState([
    'SSC',
    'SBO',
    'COMSOC',
    // Add more recipients as needed
  ]);

  const handleItemClick = (label) => {
    if (label === "Dashboard") {
      navigate('/dashboard'); // Redirect to /dashboard
    } else {
      setModalContent(label);
      setModalOpen(true); // Open the modal for other items
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = () => {
    // Add your form submission logic here
    console.log('Form submitted');
    closeModal();
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
      
      <h2 className={styles.sectionTitle}>My Transaction</h2>
      {transactionItems.map((item, index) => (
        <NavigationItem key={`trans-${index}`} {...item} />
      ))}
      
      <h2 className={styles.sectionTitle}>Manage</h2>
      {manageItems.map((item, index) => (
        <NavigationItem key={`manage-${index}`} {...item} />
      ))}
      
      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Transfer In">
        <div className={styles.modalContent}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Serial Number</label>
            <input type="text" placeholder="Enter Serial Number" className={styles.input} />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Document Name</label>
            <input type="text" placeholder="Enter Document Name" className={styles.input} />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Recipient</label>
            <select className={styles.select}>
              <option value="">Select Recipient</option>
              {recipients.map((recipient, index) => (
                <option key={index} value={recipient}>{recipient}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>User ID</label>
            <input type="text" placeholder="Enter User ID" className={styles.input} />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Remarks</label>
            <textarea placeholder="Enter remarks..." className={styles.textarea}></textarea>
          </div>
          
          <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
        </div>
      </Modal>
    </nav>
  );
};

export default SideNavigation;
