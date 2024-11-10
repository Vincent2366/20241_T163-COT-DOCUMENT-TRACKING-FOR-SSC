import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../SideNavigation/SideNavigation.module.css';
import { NavigationItem } from '../SideNavigation/NavigationItem';
import Modal from '../../Modal';

const adminNavigationItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/005c7a1fc7b800da9ed0eb7da389c028dba409099cc177f99c94e1fb260ee196?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", 
    label: "Dashboard", 
    isActive: true, 
    link: "/admin/dashboard" 
  },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ef14105a500b66854f89c5620f3d32e2a5dbaf09c38aedabb17f4c76b9ab15f4?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", 
    label: "New User Approval" 
  },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ef14105a500b66854f89c5620f3d32e2a5dbaf09c38aedabb17f4c76b9ab15f4?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", 
    label: "Add New Organization", 
    link: "/admin/add-organization" 
  }
];

const Management = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fdf6a3c79bdaad8ecf0558b37a861092b45999045f1f0e63787a112b3c20be64?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", 
    label: "Manage Users" 
  },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fdf6a3c79bdaad8ecf0558b37a861092b45999045f1f0e63787a112b3c20be64?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", 
    label: "Manage Organizations", 
    link: "/admin/manage-organizations" 
  }
];

const AdminSideNavigation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOrgModalOpen, setAddOrgModalOpen] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgId, setOrgId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleItemClick = (label, link) => {
    if (link) {
      if (label === "Add New Organization") {
        setAddOrgModalOpen(true);
      } else {
        navigate(link);
      }
    }
  };

  const handleAddOrgSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:2000/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: orgName,
          organizationId: orgId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message.includes('duplicate organization name')) {
          throw new Error('Organization name already exists.');
        } else if (errorData.message.includes('duplicate organization ID')) {
          throw new Error('Organization ID already exists.');
        } else {
          throw new Error(errorData.message || 'Failed to create organization');
        }
      }

      const data = await response.json();
      console.log('Organization created:', data);
      
      setOrgName('');
      setOrgId('');
      setSuccessMessage('Successfully created!');
      setAddOrgModalOpen(false);

      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.messageContainer}>
        {successMessage && <div className={styles.success}>{successMessage}</div>}
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      </div>

      <nav className={styles.sideNav}>
        {adminNavigationItems.map((item, index) => (
          <div key={index} onClick={() => handleItemClick(item.label, item.link)}>
            <NavigationItem {...item} />
          </div>
        ))}

        <h2 className={styles.sectionTitle}>Management</h2>
        {Management.map((item, index) => (
          <div key={index} onClick={() => handleItemClick(item.label, item.link)}>
            <NavigationItem {...item} />
          </div>
        ))}

        <Modal isOpen={isAddOrgModalOpen} onClose={() => setAddOrgModalOpen(false)} title="Add New Organization">
          <form className={styles.modalContent} onSubmit={handleAddOrgSubmit}>
            <label>
              Organization:
              <input 
                type="text" 
                placeholder="Enter organization name" 
                value={orgName} 
                onChange={(e) => setOrgName(e.target.value)} 
              />
            </label>
            <label>
              Organization ID:
              <input 
                type="text" 
                placeholder="Enter organization ID" 
                value={orgId} 
                onChange={(e) => setOrgId(e.target.value)} 
              />
            </label>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Add Organization'}
            </button>
          </form>
        </Modal>
      </nav>
    </div>
  );
};

export default AdminSideNavigation;