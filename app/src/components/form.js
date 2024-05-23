import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faGlobe } from '@fortawesome/free-solid-svg-icons';
import hospitalimg from './images/hospitalimg.png';
import { useNavigate } from 'react-router-dom';

const Form = () => {
  const navigate = useNavigate();  // Hook for programmatic navigation 
  const [mode, setMode] = useState('light');
  const [language, setLanguage] = useState('ar');
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    type: 'controle' // Default value for the select input
  });
  const [patientNumber, setPatientNumber] = useState(localStorage.getItem('patientNumber') || null);
  const [patientsBefore, setPatientsBefore] = useState(null);

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const toggleLanguage = () => {
    setLanguage(prevLanguage => (prevLanguage === 'ar' ? 'fr' : 'ar'));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token'); // Retrieve the token from local storage

    if (!token) {
      alert('No authorization token found. Please log in.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // Include the token in the request headers
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Response:', result); // Add logging for debugging
      if (response.ok) {
        // Update local storage and possibly state with the new numero
        navigate('/waiting', { state: { numero: result.numero } });
        localStorage.setItem('patientNumber', result.numero);
        alert(`Patient added successfully. Your waiting number is ${result.numero}`);

        // Fetch the count of patients before the current patient
        const countResponse = await fetch(`http://localhost:3001/api/patients/before/${result.numero}`, {
          headers: {
            'Authorization': token
          }
        });

        const countResult = await countResponse.json();
        setPatientsBefore(countResult.count);
      } else {
        throw new Error(result.error || 'Failed to add patient');
      }
    } catch (error) {
      console.error('Failed to add patient:', error.message);
      alert('Failed to add patient. Please check the console for more information.');
    }
  };

  useEffect(() => {
    // Optionally handle re-fetching or updates here
  }, []);

  return (
    <div className={`form-container ${mode}`}>
      <h2 className={language === 'ar' ? 'arabic-text' : ''}>
        {language === 'fr' ? 'Bonjour, veuillez remplir le formulaire ci-dessous' : 'مرحبًا، يرجى ملء النموذج أدناه'}
      </h2>
      <button className="language-toggle" onClick={toggleLanguage}>
        <FontAwesomeIcon icon={faGlobe} />
      </button>
      <button className="mode-toggle" onClick={toggleMode}>
        {mode === 'light' ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}
      </button>
      <div className="content-container">
        <img src={hospitalimg} alt="Hospital" className="form-image" />
        <form className={`user-form ${language === 'ar' ? 'arabic-form' : ''}`} onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="prenom">{language === 'fr' ? 'Prénom' : 'الاسم الشخصي'}</label>
            <input type="text" id="prenom" placeholder={language === 'fr' ? 'Prénom' : 'الاسم الشخصي'} name="prenom" required value={formData.prenom} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="nom">{language === 'fr' ? 'Nom' : 'الاسم العائلي'}</label>
            <input type="text" id="nom" placeholder={language === 'fr' ? 'Nom' : 'الاسم العائلي'} name="nom" required value={formData.nom} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="type">{language === 'fr' ? 'Type' : 'النوع'}</label>
            <select id="type" name="type" value={formData.type} onChange={handleChange}>
              <option value="controle">{language === 'fr' ? 'Contrôle' : 'فحص'}</option>
              <option value="visite">{language === 'fr' ? 'Visite' : 'زيارة'}</option>
            </select>
          </div>
          <button type="submit" className="submit-button">
            {language === 'fr' ? 'Valider' : 'تأكيد المعلومات'}
          </button>
        </form>
      </div>
      {patientsBefore !== null && (
        <div className="patients-before">
          {language === 'fr' ? `Il y a ${patientsBefore} patients avant vous` : `يوجد ${patientsBefore} مريض قبلك`}
        </div>
      )}
    </div>
  );
};

export default Form;
