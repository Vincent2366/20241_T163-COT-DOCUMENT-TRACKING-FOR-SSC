import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './SideNavigation.module.css';
import { NavigationItem } from './NavigationItem';
import Modal from '../../Modal'; // Adjust the path as necessary
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:2000'; // or whatever port your backend is running on

const navigationItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/005c7a1fc7b800da9ed0eb7da389c028dba409099cc177f99c94e1fb260ee196?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "Dashboard", isActive: true, link: "/dashboard", view: "documents" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/b926edca9da2bd02e758e006f2ebaf4a5943ec2e14c0bc7043ff1638257afb48?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "New Document", view: "transactions" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/62af66e9f4c012032bfebdb68e774d2cca1b439bb2c9f816d6066d03b5c1cafc?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a", label: "Transfer In", link: "/dashboard/transfer-in", status: "accept", view: "transactions" },
  { icon: "/images/icon.png", label: "Pending", link: "/dashboard/pending", status: "pending", view: "transactions" },
];

const documentItems = [
  { 
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/5eb33c88da331cbd7c80d172ba8a5de6d7debd99be7fac7149b15af2863f8670", 
    label: "All", 
    link: "/dashboard/history",
    view: "documents"
  },
  { 
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/299f0b10ae60643f7737cf49c147dcc13c34aad7e5b16295767fbcbfae42acd2", 
    label: "In Transit", 
    link: "/dashboard/history/in-transit",
    view: "documents"
  },
  { 
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/c23e99a6561a8d6f026efdd6ce16ade880ca84befe6ed8629ae672d7b96ade03", 
    label: "Finished", 
    link: "/dashboard/history/finished",
    view: "documents"
  },

];

const SideNavigation = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
  });
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    accept: 0
  });
  const [userOrg, setUserOrg] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get user data when component mounts
    const getUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserOrg(response.data.organization);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:2000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        if (!userOrg) return; // Don't fetch if we don't have user organization
        
        console.log('Fetching counts for organization:', userOrg);
        const response = await axios.get(`/api/documents/status-counts?organization=${userOrg}`);
        console.log('Status counts response:', response.data);
        
        setStatusCounts({
          pending: response.data.pending || 0,
          accept: response.data.accept || 0
        });
      } catch (error) {
        console.error('Error fetching status counts:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
      }
    };

    if (userOrg) {
      fetchStatusCounts();
      const interval = setInterval(fetchStatusCounts, 60000);
      return () => clearInterval(interval);
    }
  }, [userOrg]); // Depend on userOrg

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get('/api/organizations');
        setOrganizations(response.data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleItemClick = (label, link, view) => {
    if (link) {
      if (label === "Transfer In") {
        navigate('/dashboard', { state: { filter: 'Accept', view } });
      } else if (label === "Pending") {
        navigate('/dashboard', { state: { filter: 'pending', view } });
      } else if (label === "All") {
        navigate('/dashboard', { state: { filter: 'all', view } });
      } else if (label === "In Transit") {
        navigate('/dashboard', { state: { filter: 'in-transit', view } });
      } else if (label === "Finished") {
        navigate('/dashboard', { state: { filter: 'finished', view } });
      } else if (label === "Transferred Out") {
        navigate('/dashboard', { state: { filter: 'transferred', view } });
      } else {
        navigate(link, { state: { view } });
      }
    } else if (label === "New Document") {
      setModalTitle("New Document");
      setModalContent("new-document");
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.target);
      const documentData = {
        serialNumber: formData.get('serialNumber'),
        documentName: formData.get('documentName'),
        description: formData.get('description'),
        recipient: formData.get('recipient'),
        userId: currentUser?.username,
        remarks: formData.get('remarks'),
        status: 'pending',
        createdAt: new Date().toISOString(),
        currentOffice: currentUser?.organization,
        originalSender: currentUser?.organization
      };

      const response = await axios.post('/api/documents/new', documentData);

      if (response.data.success) {
        setSuccessMessage('Document created successfully');
        setModalOpen(false);
        // Optionally refresh the document list
      }
    } catch (error) {
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to create document');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className={styles.sideNav}>
      {navigationItems.map((item, index) => (
        <div key={index} onClick={() => handleItemClick(item.label, item.link, item.view)}>
          <NavigationItem 
            {...item} 
            counts={item.status ? statusCounts : null} 
          />
        </div>
      ))}
      
      <h2 className={styles.sectionTitle}>My Documents</h2>
      {documentItems.map((item, index) => (
        <div key={`doc-${index}`} onClick={() => handleItemClick(item.label, item.link, item.view)}>
          <NavigationItem {...item} />
        </div>
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
              <label className={styles.label}>Description</label>
              <textarea 
                name="description"
                placeholder="Enter document description"
                className={styles.textarea}
                rows={2}
                style={{ minHeight: '60px' }}
              ></textarea>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Recipient</label>
              <select name="recipient" className={styles.select} required>
                <option value="">Select Recipient</option>
                <optgroup label="USG/Institutional">
                  {organizations
                    .filter(org => org.type === 'USG/Institutional')
                    .map((org) => (
                      <option key={org._id} value={org.name}>{org.name}</option>
                    ))}
                </optgroup>
                <optgroup label="Academic Organizations">
                  {organizations
                    .filter(org => org.type === 'ACADEMIC')
                    .map((org) => (
                      <option key={org._id} value={org.name}>{org.name}</option>
                    ))}
                </optgroup>
                <optgroup label="Civic Organizations">
                  {organizations
                    .filter(org => org.type === 'CIVIC')
                    .map((org) => (
                      <option key={org._id} value={org.name}>{org.name}</option>
                    ))}
                </optgroup>
                <optgroup label="Religious Organizations">
                  {organizations
                    .filter(org => org.type === 'RELIGIOUS')
                    .map((org) => (
                      <option key={org._id} value={org.name}>{org.name}</option>
                    ))}
                </optgroup>
                <optgroup label="Fraternity and Sorority">
                  {organizations
                    .filter(org => org.type === 'FRATERNITY AND SORORITY')
                    .map((org) => (
                      <option key={org._id} value={org.name}>{org.name}</option>
                    ))}
                </optgroup>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>User Information</label>
              <div className={styles.userInfoBox}>
                <div className={styles.username}>{currentUser?.username}</div>
                <div className={styles.organizationText}>from: {currentUser?.organization}</div>
              </div>
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