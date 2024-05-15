const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Specify the path to your SQLite database file
const dbPath = 'C:\\Users\\salma\\OneDrive\\Bureau\\hospitalDB\\db.db';

// SQLite database connection
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
});

// Function to log all patients from the database
function fetchAndLogPatients() {
  db.all("SELECT * FROM patients", (err, rows) => {
    if (err) {
      console.error('Failed to retrieve patients:', err.message);
    } else {
      console.log('Patients retrieved on server start:', rows);
    }
  });
}

// Handle GET requests to retrieve all patients
app.get('/api/patients', (req, res) => {
  db.all("SELECT * FROM patients", (err, rows) => {
    if (err) {
      console.error('Failed to retrieve patients:', err.message);
      res.status(500).json({ error: 'Failed to retrieve patients' });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Handle GET request to count patients before a given numero
app.get('/api/patients/before/:numero', (req, res) => {
  const numero = parseInt(req.params.numero);
  const query = "SELECT COUNT(*) AS count FROM patients WHERE numero < ?";
  db.get(query, [numero], (err, result) => {
    if (err) {
      console.error('Failed to retrieve number of patients before:', err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ count: result.count });
    }
  });
});

// Handle POST requests to add a new patient
app.post('/api/patients', (req, res) => {
  const { prenom, nom, type } = req.body;
  const findNumero = "SELECT MAX(numero) as maxNumero FROM patients";
  db.get(findNumero, (error, row) => {
    if (error) {
      console.error('Failed to retrieve max numero:', error.message);
      return res.status(500).json({ error: 'Failed to retrieve max numero' });
    }
    const maxNumero = row.maxNumero ? row.maxNumero + 1 : 1;
    const sql = "INSERT INTO patients (prenom, nom, type, numero) VALUES (?, ?, ?, ?)";
    const params = [prenom, nom, type, maxNumero];
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Failed to add patient:', err.message);
        res.status(500).json({ error: 'Failed to add patient' });
      } else {
        console.log(`A new patient has been added with numero: ${maxNumero}`);
        res.status(201).json({ id: this.lastID, prenom, nom, type, numero: maxNumero });
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  fetchAndLogPatients();
});
