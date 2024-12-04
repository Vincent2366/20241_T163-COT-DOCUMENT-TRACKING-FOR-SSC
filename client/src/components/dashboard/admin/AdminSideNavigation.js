import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../SideNavigation/SideNavigation.module.css';
import { NavigationItem } from '../SideNavigation/NavigationItem';
import Modal from '../../Modal';
import FeedbackMessage from '../../feedbackMessage';

const adminNavigationItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/005c7a1fc7b800da9ed0eb7da389c028dba409099cc177f99c94e1fb260ee196?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", 
    label: "Dashboard", 
    link: "/admin/dashboard" 
  },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ef14105a500b66854f89c5620f3d32e2a5dbaf09c38aedabb17f4c76b9ab15f4?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", 
    label: "New User Approval",
    link: "/admin/pending-users"
  },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ef14105a500b66854f89c5620f3d32e2a5dbaf09c38aedabb17f4c76b9ab15f4?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", 
    label: "Add New Organization", 
    link: "/admin/add-organization" 
  }
];

const Management = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fdf6a3c79bdaad8ecf0558b37a861092b45999045f1f0e63787a112b3c20be64?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", 
    label: "Manage Users",
    link: "/admin/manage-users"
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
  const [orgType, setOrgType] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');
  const navigate = useNavigate();

  const handleItemClick = (label, link) => {
    if (link) {
      if (label === "Add New Organization") {
        setAddOrgModalOpen(true);
      } else if (label === "Dashboard") {
        navigate(link);
      } else if (label === "Manage Organizations") {
        navigate(link);
      } else if (label === "Manage Users") {
        navigate(link);
      } else if (label === "New User Approval") {
        navigate(link);
      }
    }
  };

  const handleAddOrgSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMessage('');
    setIsLoading(true);

    if (!orgType) {
      setFeedbackMessage('Please select an organization type.');
      setFeedbackType('error');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:2000/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: orgName,
          type: orgType, 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message.includes('duplicate organization name')) {
          throw new Error('Organization name already exists.');
        } else {
          throw new Error(errorData.message || 'Failed to create organization');
        }
      }

      const data = await response.json();
      console.log('Organization created:', data);

      setOrgName('');
      setOrgType('');
      setFeedbackMessage('Successfully created! ✅');
      setFeedbackType('success');
      setAddOrgModalOpen(false);

      setTimeout(() => {
        setFeedbackMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setFeedbackMessage(error.message);
      setFeedbackType('error');
      setTimeout(() => setFeedbackMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <FeedbackMessage message={feedbackMessage} type={feedbackType} />

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
                required 
              />
            </label>
            <label>
              Organization Type:
              <select 
                value={orgType} 
                onChange={(e) => setOrgType(e.target.value)} 
                required
              >
                <option value="" disabled>Select type</option>
                <option value="USG/Institutional">USG/Institutional</option>
                <option value="ACADEMIC">Academic</option>
                <option value="CIVIC">Civic</option>
                <option value="RELIGIOUS">Religious</option>
                <option value="FRATERNITY AND SORORITY">Fraternity and Sorority</option>
              </select>
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