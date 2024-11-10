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
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fdf6a3c79bdaad8ecf0558b37a861092b45999045f1f0e63787a112b3c20be64?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", 
    label: "Manage Users" 
  },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ef14105a500b66854f89c5620f3d32e2a5dbaf09c38aedabb17f4c76b9ab15f4?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", 
    label: "Add New Organization" 
  },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fdf6a3c79bdaad8ecf0558b37a861092b45999045f1f0e63787a112b3c20be64?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", 
    label: "Manage Organizations" 
  },
];

const documentItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/5eb33c88da331cbd7c80d172ba8a5de6d7debd99be7fac7149b15af2863f8670?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", 
    label: "All Documents" 
  },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/299f0b10ae60643f7737cf49c147dcc13c34aad7e5b16295767fbcbfae42acd2?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", 
    label: "Pending Documents" 
  },
];

const AdminSideNavigation = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const navigate = useNavigate();

  const handleItemClick = (label) => {
    if (label === "Dashboard") {
      navigate('/admin/dashboard');
    } else {
      setModalTitle(label);
      setModalContent(label);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <nav className={styles.sideNav}>
      {adminNavigationItems.map((item, index) => (
        <div key={index} onClick={() => handleItemClick(item.label)}>
          <NavigationItem {...item} />
        </div>
      ))}
      
      <h2 className={styles.sectionTitle}>Documents</h2>
      {documentItems.map((item, index) => (
        <NavigationItem key={`doc-${index}`} {...item} />
      ))}
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        {/* Add modal content for admin actions */}
      </Modal>
    </nav>
  );
};

export default AdminSideNavigation; 