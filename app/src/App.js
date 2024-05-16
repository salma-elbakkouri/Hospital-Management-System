import React from 'react';
import WaitingRoom from './components/user-interface';
import './components/css/userInterface.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WaitingNumberDisplay from './components/waiting-line';
import Form from './components/form';
import AdminLogin from './components/admin-login';
import AdminDashboard from './components/admin-dashboard'

function App() {
  return (
    <Router>
      <Routes>
        {/* Client Side Routes */}
        <Route path="/" element={<Form />} />
        <Route path="/waiting" element={<WaitingNumberDisplay />} />

        {/* Admin Side Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
