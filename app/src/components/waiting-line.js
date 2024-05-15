import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faGlobe } from '@fortawesome/free-solid-svg-icons';

function WaitingNumberDisplay() {
  const location = useLocation();
  const { numero } = location.state || { numero: 'Unavailable' };
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('Arabic');
  const [peopleBefore, setPeopleBefore] = useState(0);

  useEffect(() => {
    const fetchPeopleBefore = async () => {
      if (numero !== 'Unavailable') {
        try {
          const response = await fetch(`http://localhost:3001/api/patients/before/${numero}`);
          const data = await response.json();
          setPeopleBefore(data.count);
        } catch (error) {
          console.error('Failed to fetch the number of people before:', error);
        }
      }
    };

    fetchPeopleBefore();
  }, [numero]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'Arabic' ? 'French' : 'Arabic');
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      backgroundColor: darkMode ? '#133947' : '#ffffff',
      color: darkMode ? '#ffffff' : '#333',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      position: 'relative',
    },
    text: {
      fontSize: '2rem',
      marginBottom: '0.5rem',
    },
    number: {
      fontSize: '200px',
      fontWeight: 'bold',
      color: darkMode ? '#fff' : '#133947',
    },
    peopleBeforeText: {
      fontSize: '1.5rem',
      marginTop: '20px',
    },
    icon: {
      position: 'absolute',
      top: '20px',
      cursor: 'pointer',
      fontSize: '24px',
      color: darkMode ? '#ffffff' : '#000', // Icons color changes with dark mode
    },
    sunIcon: {
      right: '1.5rem',
    },
    globeIcon: {
      left: '1.5rem',
    }
  };

  return (
    <div style={styles.container}>
      <FontAwesomeIcon icon={faGlobe} style={{ ...styles.icon, ...styles.globeIcon }} onClick={toggleLanguage} />
      <FontAwesomeIcon icon={darkMode ? faSun : faMoon} style={{ ...styles.icon, ...styles.sunIcon }} onClick={toggleDarkMode} />
      <h1 style={styles.text}>{language === 'French' ? 'Votre numéro dans la liste d’attente' : 'رقمك في قائمة الانتظار'}</h1>
      <p style={styles.number}>{numero}</p>
      <p style={styles.peopleBeforeText}>
        {language === 'French' ? `Nombre de personnes avant vous : ${peopleBefore}` : `عدد الأشخاص قبلك : ${peopleBefore}`}
      </p>
    </div>
  );
}

export default WaitingNumberDisplay;