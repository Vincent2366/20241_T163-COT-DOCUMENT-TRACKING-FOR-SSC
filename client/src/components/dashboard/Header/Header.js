import React, { useState, useEffect, useRef } from 'react';
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const CLIENT_ID = '465216288473-9t6vhd30arvjfjtogqinvbtj9a6vnmjc.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCAq7zCrb2WvN03qb52D0FHsPfY3OEzO-o';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

export function Header() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
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
      setIsAuthenticated(true);
    }
    gapi.load('client:auth2', start);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

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

  const handleAuthClick = async () => {
    try {
      console.log("Attempting to sign in...");
      await gapi.auth2.getAuthInstance().signIn();
      console.log("User signed in successfully");
      // Proceed with fetching calendar data
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleSignoutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    try {
      // Clear any local storage or session storage items
      localStorage.removeItem('user'); // Adjust this based on your storage method
      sessionStorage.clear();

      // Reset any authentication state in your app
      // setIsAuthenticated(false); // Uncomment if you have this state

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

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoSection}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/7d8957aa15cd019cfb7e4d3d8cd8e10643cc08e791928cc651246f452f1a63ec?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a" alt="Company Logo" className={styles.mainLogo} />
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/afae7e68f233fb9ccd60978ad0ed1cf569a5748d87997d3f6cdf60cd8ea424c1?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a" alt="Secondary Logo" className={styles.secondaryLogo} />
      </div>
      <div className={styles.userSection}>
        <nav className={styles.headerNav}>
          <div className={styles.calendarIconContainer} onClick={toggleCalendar}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/1eaec27ef17cb768bc36b6df35592458c456fe90ea0a0b8123d7cff5a8423a8a?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a"
              alt="Calendar Icon"
            />
          </div>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/804b63a8ef2260387a5f1c1092038331b625470de795379c107be68e67034a35?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a" alt="Settings Icon" className={styles.settingsIcon} />
          <div className={styles.notificationIconContainer} ref={notificationRef}>
            <svg
              className={styles.notificationIcon}
              onClick={toggleNotifications}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {showNotifications && (
              <div className={styles.notificationDropdown}>
                <h3>Notifications</h3>
                <ul>
                  <li>New message from John Doe</li>
                  <li>Your report is ready</li>
                  <li>Meeting scheduled for tomorrow</li>
                </ul>
              </div>
            )}
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
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/40de4afe7756242bae0b94bb31dd4d0e506fdfca0602fd790cfcf481e417d257?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a" 
            alt="User Avatar" 
            className={styles.userAvatar}
            onClick={toggleProfileMenu}
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