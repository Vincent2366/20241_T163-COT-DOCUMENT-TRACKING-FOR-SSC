import React, { useState, useRef, useEffect } from 'react';
import styles from './UserProfile.module.css';
import logo from '../../../assets/SSClogo.png';
import axios from 'axios';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

export function UserProfile() {
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    organization: '',
    role: '',
    status: '',
    profilePicture: null,
    driveFileLink: null
  });
  const [organizations, setOrganizations] = useState([]);

  // Modal styles
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      maxWidth: '500px',
      width: '90%'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get('http://localhost:2000/api/organizations');
        setOrganizations(response.data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };
    fetchOrganizations();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:2000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Profile data:', response.data);
      
      // Store the complete URL in state
      const profilePicture = response.data.profilePicture || 'https://via.placeholder.com/150';

      setFormData(prev => ({
        ...prev,
        ...response.data,
        profilePicture: profilePicture
      }));
      
      // Store profile picture URL in localStorage for persistence
      localStorage.setItem('userProfilePicture', profilePicture);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  // Add this useEffect to initialize profile picture from localStorage
  useEffect(() => {
    const savedProfilePicture = localStorage.getItem('userProfilePicture');
    if (savedProfilePicture) {
      setFormData(prev => ({
        ...prev,
        profilePicture: savedProfilePicture
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:2000/api/users/upload-profile-picture',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        const newProfilePicture = `http://localhost:2000${response.data.user.profilePicture}`;
        
        setFormData(prev => ({
          ...prev,
          profilePicture: newProfilePicture
        }));
        
        // Update localStorage with new profile picture URL
        localStorage.setItem('userProfilePicture', newProfilePicture);
        
        setSuccessMessage('Profile picture updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError('Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:2000/api/users/update-profile', {
        username: formData.username,
        email: formData.email,
        organization: formData.organization,
        role: formData.role,
        ...(formData.password && { password: formData.password })
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setFormData(prev => ({
        ...prev,
        ...response.data.user,
        password: '',
        confirmPassword: ''
      }));
      setIsModalOpen(false);
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className={styles.profileContainer}>
      {loading ? (
        <div className={styles.loading}>Loading profile...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profilePictureContainer} onClick={handleImageClick}>
              <img
                src={formData.profilePicture}
                alt="Profile"
                className={styles.profilePicture}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            <h1>Profile Information</h1>
          </div>

          <div className={styles.profileContent}>
            <div className={styles.profileForm}>
              <div className={styles.formGroup}>
                <label>Username</label>
                <input 
                  type="text" 
                  value={formData.username}
                  disabled
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  disabled
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Organization</label>
                <input 
                  type="text" 
                  value={formData.organization}
                  disabled
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Role</label>
                <input 
                  type="text" 
                  value={formData.role}
                  disabled
                  className={styles.formInput}
                />
              </div>

              <button 
                className={styles.editButton}
                onClick={() => setIsModalOpen(true)}
              >
                Edit Profile
              </button>
            </div>

            <div className={styles.logoSection}>
              <img src={logo} alt="BSU Logo" className={styles.bsuLogo} />
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          style={customStyles}
          contentLabel="Edit Profile Modal"
        >
          <div className="modal-header">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            {error && (
              <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Username</label>
              <input 
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={styles.formInput}
                disabled={formData.role === 'admin'}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.formInput}
                disabled={true}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Organization</label>
              <select
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className={styles.formInput}
                disabled={formData.role === 'admin'}
              >
                <option value="">Select Organization</option>
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
              <label>Role</label>
              <input 
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={styles.formInput}
                disabled={true}
              />
            </div>

            <div className={styles.formGroup}>
              <label>New Password</label>
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Enter new password"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Confirm Password</label>
              <input 
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Confirm new password"
              />
            </div>

            <div className={styles.modalActions}>
              <button type="submit" className={styles.saveButton}>
                Save Changes
              </button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
} 