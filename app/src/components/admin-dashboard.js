import React, { useState, useEffect } from 'react';
import './css/admindashboard.css'; // Import your CSS file for styling

function AdminDashboard() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    // Fetch patients from your backend API here
    // Example: fetch('/api/patients')
    //   .then(response => response.json())
    //   .then(data => setPatients(data))
    //   .catch(error => console.error('Error fetching patients:', error));
    // For demonstration, I'll use a static array
    const patientsData = [
      { id: 1, nom: 'Doe', prenom: 'John', type: 'Type A' },
      { id: 2, nom: 'Smith', prenom: 'Jane', type: 'Type B' },
      // Add more patient data as needed
    ];
    setPatients(patientsData);
  };

  return (
    <div className="admin-panel">
      <div className="sidebar">
        <div className="menu">
          <div className="menu-item active">Patients</div>
          <div className="menu-item">Statistiques</div>
          {/* Add more menu items as needed */}
          <div className="menu-item logout">Se déconnecter</div>
        </div>
      </div>
      <div className="content">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <table className="patients-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.nom}</td>
                <td>{patient.prenom}</td>
                <td>{patient.type}</td>
                <td>
                  <button className="btn">Terminer Visite</button>
                  <button className="btn">Annuler Visite</button>
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
