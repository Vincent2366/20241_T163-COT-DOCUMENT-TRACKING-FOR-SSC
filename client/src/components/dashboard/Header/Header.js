import React, { useState } from 'react';
import styles from './Header.module.css';

export function Header() {
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendar = () => {
    setShowCalendar(prev => !prev);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoSection}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/7d8957aa15cd019cfb7e4d3d8cd8e10643cc08e791928cc651246f452f1a63ec?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a" alt="Company Logo" className={styles.mainLogo} />
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/afae7e68f233fb9ccd60978ad0ed1cf569a5748d87997d3f6cdf60cd8ea424c1?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a" alt="Secondary Logo" className={styles.secondaryLogo} />
      </div>
      <div className={styles.userSection}>
        <nav className={styles.headerNav}>
        <div className={styles.calendarIconContainer}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1eaec27ef17cb768bc36b6df35592458c456fe90ea0a0b8123d7cff5a8423a8a?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a"
            alt="Calendar Icon"
            className={styles.calendarIcon}
            onClick={toggleCalendar}
          />
        </div>
        {/* Calendar Dropdown */}
        {showCalendar && (
          <div className={styles.calendarContainer}>
            <iframe
              src="https://calendar.google.com/calendar/embed?src=&ctz=Your_Time_Zone"
              style={{ border: 0 }}
              width="400"
              height="300"
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        )}
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/804b63a8ef2260387a5f1c1092038331b625470de795379c107be68e67034a35?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a" alt="Settings Icon" className={styles.settingsIcon} />
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/37b5ab5fee7535ecfc3a5a78e2fb4f1536d34b1a223c85318991fecc49dda32e?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a" alt="Notifications Icon" className={styles.notificationIcon} />
          <div className={styles.notificationBell} />
        </nav>
        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <span className={styles.userName}>Admin00001</span>
            <span className={styles.userEmail}>admin00001@servicedeck.io</span>
          </div>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e9667bf3d44a796609e16f3d9e75c5b9bd0e14b2b956da12942d4331e6024f09?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a" alt="" className={styles.dropdownIcon} />
        </div>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/40de4afe7756242bae0b94bb31dd4d0e506fdfca0602fd790cfcf481e417d257?placeholderIfAbsent=true&apiKey=1194e150faa74888af77be55eb83006a" alt="User Avatar" className={styles.userAvatar} />
      </div>
    </header>
  );
}
