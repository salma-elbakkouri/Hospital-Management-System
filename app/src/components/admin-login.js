import React, { useState } from 'react';
import axios from 'axios';
import '../components/css/login.css'; // Ensure the path is correct
import { FaSun, FaMoon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/admin/login', { username, password });
      alert(response.data.message);
      // Save the token if needed
      localStorage.setItem('token', response.data.token);
      // Redirect to admin dashboard or another route
      navigate('/admin/dashboard');
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="dark-mode-toggle" onClick={handleToggle}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </div>
      <p className='admin-text'>Admin Login</p>
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Connexion Admin</h1>
        <p>Veuillez saisir les informations : </p>
        <input
          type="text"
          placeholder="nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default AdminLogin;
