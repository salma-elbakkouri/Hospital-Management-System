import React, { useState } from 'react';
import '../components/css/userInterface.css';
import waitingImage from '../components/images/waitingImage.gif';
import logoImage from '../components/images/logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const translations = {
  en: {
    title: "Tenez bon !",
    estimatedTime: "La position actuelle dans la file d'attente est : ",
  },
  ar: {
    title: "!تحلى بالصبر",
    estimatedTime: "الوضع الحالي في الطابور: ",
  },
};

const WaitingRoom = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const { title, estimatedTime } = translations[language];

  return (
    <div className={`waiting-room ${darkMode ? 'dark-mode' : ''}`}>
      <div className="background"></div>
      <div className="toggle-icon" onClick={toggleDarkMode}>
        <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
      </div>
      <div className={`language-icon ${darkMode ? 'white-icon' : ''}`} onClick={toggleLanguage}>
        <i className="fas fa-language"></i>
      </div>
      <div className="content">
        <img src={waitingImage} alt="Waiting" className="waiting-image" />
        <h1>{title}</h1>
        <p className="estimated-time">{estimatedTime} <br /> <span className='current-number'>17</span></p>
      </div>
    </div>
  );
};

export default WaitingRoom;
