import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/admindashboard.css'; // Update your CSS file name accordingly
import { FaUserAlt, FaChartPie, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function Statistiques() {
    const [visitesTermines, setVisitesTermines] = useState([]);
    const [visitesAnnules, setVisitesAnnules] = useState([]);

    useEffect(() => {
        fetchVisitesTermines();
        fetchVisitesAnnules();
    }, []);

    const fetchVisitesTermines = async () => {
        try {
            const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
            const response = await axios.get('http://localhost:3001/api/visitestermines', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setVisitesTermines(response.data);
        } catch (error) {
            console.error('Error fetching visites termines:', error);
        }
    };

    const fetchVisitesAnnules = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/api/visitesannules', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setVisitesAnnules(response.data);
        } catch (error) {
            console.error('Error fetching visites annules:', error);
        }
    };

    return (
        <div className="admin-panel">
            <div className="sidebar">
                <div className="sidebar-header">
                    <span className="sidebar-title">Statistiques des Visites</span>
                </div>
                <div className="menu">
                    <Link to="/admin/dashboard" className="menu-item">
                        <FaUserAlt className="menu-icon" /> Patients
                    </Link>
                    <div className="menu-item">
                        <FaUsers className="menu-icon" /> Utilisateurs
                    </div>
                    <Link to="/admin/statistiques" className="menu-item active">
                        <FaChartPie className="menu-icon" /> Statistiques
                    </Link>

                    <div className="menu-item logout">
                        <FaSignOutAlt className="menu-icon" /> Se déconnecter
                    </div>
                </div>
            </div>
            <div className="content">
                <h2>Les Visites Terminées</h2>
                <table className="patients-table">
                    <thead>
                        <tr>
                            <th>Numero</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Type de visite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visitesTermines.map(visite => (
                            <tr key={visite.id}>
                                <td>{visite.numero}</td>
                                <td>{visite.nom}</td>
                                <td>{visite.prenom}</td>
                                <td>{visite.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Les Visites Annulées</h2>
                <table className="patients-table">
                    <thead>
                        <tr>
                            <th>Numero</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Type de visite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visitesAnnules.map(visite => (
                            <tr key={visite.id}>
                                <td>{visite.numero}</td>
                                <td>{visite.nom}</td>
                                <td>{visite.prenom}</td>
                                <td>{visite.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Statistiques;
