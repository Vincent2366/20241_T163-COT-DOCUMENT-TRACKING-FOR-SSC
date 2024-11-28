import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './SideNavigation.module.css';
import { NavigationItem } from './NavigationItem';
import Modal from '../../Modal'; 
import axios from 'axios';
import { Select, Checkbox } from 'antd'; 

axios.defaults.baseURL = 'http://localhost:2000'; 

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
    view: "transactions"
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
  const [selectedRecipients, setSelectedRecipients] = useState([]);

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
    
    if (label === "New Document") {
      setModalTitle("New Document");
      setModalContent("new-document");
      setModalOpen(true);
    } else if (label === "All") { 
      console.log('Clicking all'); 
      navigate('/dashboard', { 
        state: { 
          filter: 'all', 
          view: 'transactions', 
          organization: currentUser?.organization 
        } 
      });
    } else if (link) {
      if (label === "Transfer In") {
        navigate('/dashboard', { state: { filter: 'Accept', view } });
      } else if (label === "Pending") {
        navigate('/dashboard', { state: { filter: 'pending', view } });
      } else if (label === "In Transit") {
        navigate('/dashboard', { state: { filter: 'in-transit', view } });
      } else if (label === "Finished") {
        navigate('/dashboard', { state: { filter: 'finished', view } });
      } else if (label === "Transferred Out") {
        navigate('/dashboard', { state: { filter: 'transferred', view } });
      } else {
        navigate(link, { state: { view } });
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate recipients
    if (selectedRecipients.length === 0) {
      setError('Please select at least one recipient');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData(e.target);
      const baseSerialNumber = formData.get('serialNumber');
      const baseDocumentData = {
        documentName: formData.get('documentName'),
        description: formData.get('description'),
        userId: currentUser?.username,
        remarks: formData.get('remarks'),
        status: 'pending',
        createdAt: new Date().toISOString(),
        currentOffice: currentUser?.organization,
        originalSender: currentUser?.organization
      };

      let successCount = 0;
      let failCount = 0;

      // Process each recipient sequentially
      for (let i = 0; i < selectedRecipients.length; i++) {
        const recipient = selectedRecipients[i];
        try {
          console.log('Submitting document for recipient:', recipient);
          
          // Create unique serial number for each recipient
          const serialSuffix = selectedRecipients.length > 1 ? `-${i + 1}` : '';
          const serialNumber = `${baseSerialNumber}${serialSuffix}`;
          
          const response = await axios.post('/api/documents/new', {
            ...baseDocumentData,
            serialNumber,
            recipient: recipient.trim()
          });
          
          if (response.data.success) {
            successCount++;
          }
        } catch (error) {
          console.error('Failed to create document for:', recipient, error);
          failCount++;
        }
      }

      if (successCount > 0) {
        setSuccessMessage(`Successfully created ${successCount} document(s)`);
        if (failCount === 0) {
          setModalOpen(false);
          e.target.reset();
          setSelectedRecipients([]);
        }
      }

      if (failCount > 0) {
        setError(`Failed to create ${failCount} document(s)`);
      }

    } catch (error) {
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to create document');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllOrganizationNames = () => {
    return organizations.map(org => org.name);
  };

  const handleSelectAll = (checked) => {
    setSelectedRecipients(checked ? getAllOrganizationNames() : []);
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
              <label className={styles.label}>Recipients</label>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Select Recipients"
                onChange={setSelectedRecipients}
                value={selectedRecipients}
                dropdownRender={menu => (
                  <div>
                    <div style={{ padding: '8px' }}>
                      <Checkbox
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        checked={selectedRecipients.length === organizations.length}
                        indeterminate={selectedRecipients.length > 0 && selectedRecipients.length < organizations.length}
                      >
                        Select All
                      </Checkbox>
                    </div>
                    <div style={{ borderBottom: '1px solid #e8e8e8' }} />
                    {menu}
                  </div>
                )}
              >
                <Select.OptGroup label="USG/Institutional">
                  {organizations
                    .filter(org => org.type === 'USG/Institutional')
                    .map((org) => (
                      <Select.Option key={org._id} value={org.name}>{org.name}</Select.Option>
                    ))}
                </Select.OptGroup>
                <Select.OptGroup label="Academic Organizations">
                  {organizations
                    .filter(org => org.type === 'ACADEMIC')
                    .map((org) => (
                      <Select.Option key={org._id} value={org.name}>{org.name}</Select.Option>
                    ))}
                </Select.OptGroup>
                <Select.OptGroup label="Civic Organizations">
                  {organizations
                    .filter(org => org.type === 'CIVIC')
                    .map((org) => (
                      <Select.Option key={org._id} value={org.name}>{org.name}</Select.Option>
                    ))}
                </Select.OptGroup>
                <Select.OptGroup label="Religious Organizations">
                  {organizations
                    .filter(org => org.type === 'RELIGIOUS')
                    .map((org) => (
                      <Select.Option key={org._id} value={org.name}>{org.name}</Select.Option>
                    ))}
                </Select.OptGroup>
                <Select.OptGroup label="Fraternity and Sorority">
                  {organizations
                    .filter(org => org.type === 'FRATERNITY AND SORORITY')
                    .map((org) => (
                      <Select.Option key={org._id} value={org.name}>{org.name}</Select.Option>
                    ))}
                </Select.OptGroup>
              </Select>
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