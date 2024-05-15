import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faGlobe } from '@fortawesome/free-solid-svg-icons';
import hospitalimg from '../hospitalimg.png';

const Form = () => {
  const [mode, setMode] = useState('light');
  const [language, setLanguage] = useState('fr');

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const toggleLanguage = () => {
    setLanguage(prevLanguage => (prevLanguage === 'fr' ? 'ar' : 'fr'));
  };

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
      <button className="language-toggle" onClick={toggleLanguage}>
        <FontAwesomeIcon icon={faGlobe} />
      </button>
      <div className="content-container">
        <img src={hospitalimg} alt="image-alt" className="form-image" />
        <form className={`user-form ${language === 'ar' ? 'arabic-form' : ''}`}>

          <div className="form-group">
            <label htmlFor="prenom">
              {language === 'fr' ? 'Prénom' : 'الاسم الشخصي'}
            </label>
            <input type="text" id="prenom"
              placeholder={language === 'fr' ? 'Prénom' : 'الاسم الشخصي'}
              name="prenom" required />
          </div>
          <div className="form-group">
            <label htmlFor="nom">
              {language === 'fr' ? 'Nom' : 'الاسم العائلي'}
            </label>
            <input type="text"
              placeholder={language === 'fr' ? 'Nom' : 'الاسم العائلي'}
              id="nom" name="nom" required />
          </div>
          <div className="form-group">
            <label htmlFor="type">
            {language === 'fr' ? 'Type' : 'النوع'}
            </label>
            <select id="type" name="type">
              <option value="controle">
              {language === 'fr' ? 'Contrôle' : 'فحص'}
              </option>
              <option value="visite">
              {language === 'fr' ? 'Visite' : 'زيارة'}
              </option>
            </select>
          </div>
          <button type="submit" className="submit-button">
          {language === 'fr' ? 'Valider' : 'تأكيد المعلومات'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;