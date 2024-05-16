// code where add is working 
// secret key eb1cc3568896142f100abc92dbe2638b2678b39a433544ad1bec4c5398ab75364edd66a2c6961b1a548947920727e3aa177dc274cb2030488ef092a717d10e5e

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const SECRET_KEY = 'eb1cc3568896142f100abc92dbe2638b2678b39a433544ad1bec4c5398ab75364edd66a2c6961b1a548947920727e3aa177dc274cb2030488ef092a717d10e5e'; // Replace with your secure secret key


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Specify the path to your SQLite database file
const dbPath = 'C:\\Users\\salma\\OneDrive\\Bureau\\hospitalDB\\db.db';

// const path = require('path');
// const dbPath = path.join(__dirname, '..', 'hospitalDB.db');

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


function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
  });
}


// Handle admin login and generate JWT token
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";

  db.get(query, [username], (err, user) => {
    if (err) {
      console.error('Failed to retrieve user:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token, message: 'Login successful' });
    });
  });
});

// Handle GET requests to retrieve all patients (authentication required)
app.get('/api/patients', authenticateToken, (req, res) => {
  db.all("SELECT * FROM patients", (err, rows) => {
    if (err) {
      console.error('Failed to retrieve patients:', err.message);
      res.status(500).json({ error: 'Failed to retrieve patients' });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Handle GET request to count patients before a given numero (authentication required)
app.get('/api/patients/before/:numero', authenticateToken, (req, res) => {
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

// Handle POST requests to add a new patient (authentication required)
app.post('/api/patients', authenticateToken, (req, res) => {
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


