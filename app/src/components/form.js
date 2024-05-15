import React, { useState } from 'react';

const Form = () => {
  const [mode, setMode] = useState('light');

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`form-container ${mode}`}>
      <button className="mode-toggle" onClick={toggleMode}>
        {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
      <form className="user-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" required />
        </div>
        <div className="form-group">
          <label htmlFor="secondName">Second Name</label>
          <input type="text" id="secondName" name="secondName" required />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select id="type" name="type">
            <option value="controle">Controle</option>
            <option value="visite">Visite</option>
          </select>
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div >
  );
};

export default Form;
