const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Patient = require('./models/Patient'); // Import the Patient model

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/HospitalDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Body parser middleware
app.use(bodyParser.json());

// Define patient schema and model using Mongoose
const patientSchema = new mongoose.Schema({
    prenom: {
      type: String,
      required: true
    },
    nom: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['controle', 'visite'], // Make sure the type is one of these values
      required: true
    }
  });
  
  const Patient = mongoose.model('Patient', patientSchema);

// API endpoint to handle form submissions
app.post('/api/patients', async (req, res) => {
  try {
    const { prenom, nom, type } = req.body;
    const patient = new Patient({ prenom, nom, type });
    await patient.save();
    res.status(201).json({ message: 'Patient added successfully' });
  } catch (err) {
    console.error('Error adding patient:', err);
    res.status(500).json({ error: 'Failed to add patient' });
  }
});

// API endpoint to retrieve all patients
app.get('/api/patients', async (req, res) => {
    try {
      const patients = await Patient.find(); // Retrieve all patients from the database
      res.status(200).json(patients); // Send the patients as JSON response
    } catch (err) {
      console.error('Error retrieving patients:', err);
      res.status(500).json({ error: 'Failed to retrieve patients' });
    }
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
