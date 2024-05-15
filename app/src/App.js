import React from 'react';
import  WaitingRoom from './components/user-interface';
import './components/css/userInterface.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WaitingNumberDisplay from './components/waiting-line';
import  Form from './components/form';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/waiting" element={<WaitingNumberDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;

