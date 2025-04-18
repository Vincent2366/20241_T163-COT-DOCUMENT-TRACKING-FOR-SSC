import React, { useState, useEffect, useRef } from 'react';
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';
import { FaRegCalendarAlt } from 'react-icons/fa';
import styles from './Header.module.css';
import axios from 'axios';
import logo from '../../../assets/logo2.png';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

export function Header() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/');
    } else {
      setUser(userData);
    }
  }, [navigate]);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  const handleClickOutside = (e) => {
    if (!e.target.closest(`.${styles.calendarContainer}`) && 
        !e.target.closest(`.${styles.calendarIcon}`)) {
      setShowCalendar(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleProfileClick = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role === 'admin') {
      navigate('/admin/profile');
    } else {
      navigate('/dashboard', { 
        state: { view: 'profile' },
        replace: true
      });
    }
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    try {
      // Clear any local storage or session storage items
      localStorage.removeItem('user'); // Adjust this based on your storage method
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');

      // Close the profile menu
      setShowProfileMenu(false);

      // Redirect to the login page
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:2000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setProfilePicture(response.data.profilePicture);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoSection}>
        <img 
          src={logo} 
          alt="Logo" 
          className={styles.logo}
        />
        
      </div>
      <div className={styles.userSection}>
        <nav className={styles.headerNav}>
          <div className={styles.calendarIconContainer} onClick={toggleCalendar}>
          <FaRegCalendarAlt 
              className={styles.calendarIcon}
            />
          </div>
        </nav>
        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user?.username || 'Guest'}</span>
            <span className={styles.userEmail}>{user?.email || 'No email'}</span>
          </div>
        </div>
        <div className={styles.profileMenuContainer} ref={profileMenuRef}>
          <img 
            src={profilePicture || "https://cdn.builder.io/api/v1/image/assets/TEMP/40de4afe7756242bae0b94bb31dd4d0e506fdfca0602fd790cfcf481e417d257?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a"} 
            alt="User Avatar" 
            className={styles.userAvatar}
            onClick={toggleProfileMenu}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://cdn.builder.io/api/v1/image/assets/TEMP/40de4afe7756242bae0b94bb31dd4d0e506fdfca0602fd790cfcf481e417d257?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a";
            }}
          />
          {showProfileMenu && (
            <div className={styles.profileMenu}>
              <div className={styles.menuItem} onClick={handleProfileClick}>User Profile</div>
              <div className={styles.menuItem} onClick={handleLogout}>Log Out</div>
            </div>
          )}
        </div>
      </div>
      {showCalendar && (
        <div className={styles.calendarContainer}>
          {/* Placeholder for Google Calendar integration */}
          <iframe
            src="https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID&ctz=YOUR_TIMEZONE"
            style={{ border: 0, width: '100%', height: '600px' }}
            frameBorder="0"
            scrolling="no"
            title="Google Calendar"
          ></iframe>
        </div>
      )}
    </header>
  );
}