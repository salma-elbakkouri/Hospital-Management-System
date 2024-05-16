import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/admindashboard.css'; // Import your CSS file for styling
import { FaUserAlt, FaChartPie, FaUsers, FaSignOutAlt } from 'react-icons/fa';

function AdminDashboard() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
      const response = await axios.get('http://localhost:3001/api/patients', {
        headers: {
          'Authorization': token
        }
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleTerminateVisit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/terminate-visit', { id }, {
        headers: {
          'Authorization': token
        }
      });
      setPatients(patients.filter(patient => patient.id !== id));
    } catch (error) {
      console.error('Error terminating visit:', error);
    }
  };

  const handleCancelVisit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/cancel-visit', { id }, {
        headers: {
          'Authorization': token
        }
      });
      setPatients(patients.filter(patient => patient.id !== id));
    } catch (error) {
      console.error('Error canceling visit:', error);
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="admin-panel">
      <div className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title">Admin Dashboard</span>
        </div>
        <div className="menu">
          <div className="menu-item active">
            <FaUserAlt className="menu-icon" /> Patients
          </div>
          <div className="menu-item">
            <FaUsers className="menu-icon" /> Utilisateurs
          </div>
          <div className="menu-item">
            <FaChartPie className="menu-icon" /> Statistiques
          </div>
          
          <div className="menu-item logout">
            <FaSignOutAlt className="menu-icon" /> Se déconnecter
          </div>
        </div>
      </div>
      <div className="content"> 
        
        <table className="patients-table">
          <thead>
            <tr>
              <th>Numero</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Type de visite</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.numero}</td>
                <td>{patient.nom}</td>
                <td>{patient.prenom}</td>
                <td>{patient.type}</td>
                <td>
                  <button className="btn terminer" onClick={() => handleTerminateVisit(patient.id)}>Terminer Visite</button>
                  <button className="btn annuler" onClick={() => handleCancelVisit(patient.id)}>Annuler Visite</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
