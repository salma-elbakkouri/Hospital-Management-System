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

// SQLite database connection
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to the SQLite database.');

  // Ensure the tables exist
  db.run(`CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero INTEGER,
    nom TEXT,
    prenom TEXT,
    type TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS visitetermines (
    id INTEGER,
    numero INTEGER,
    nom TEXT,
    prenom TEXT,
    type TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES patients(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS visiteannule (
    id INTEGER,
    numero INTEGER,
    nom TEXT,
    prenom TEXT,
    type TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES patients(id)
  )`);
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
app.post('/api/patients', authenticateToken, (req, res) => {
  console.log('Received request to add patient:', req.body);
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

// Handle POST request to terminate a visit
app.post('/api/terminate-visit', authenticateToken, (req, res) => {
  const { id } = req.body;
  const selectPatient = "SELECT * FROM patients WHERE id = ?";
  const insertTerminated = "INSERT INTO visitetermines (id, numero, nom, prenom, type) VALUES (?, ?, ?, ?, ?)";
  const deletePatient = "DELETE FROM patients WHERE id = ?";

  db.get(selectPatient, [id], (err, patient) => {
    if (err) {
      console.error('Failed to retrieve patient:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve patient' });
    }
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const { numero, nom, prenom, type } = patient;
    db.run(insertTerminated, [id, numero, nom, prenom, type], (err) => {
      if (err) {
        console.error('Failed to insert into visitetermines:', err.message);
        return res.status(500).json({ error: 'Failed to insert into visitetermines' });
      }

      db.run(deletePatient, [id], (err) => {
        if (err) {
          console.error('Failed to delete patient:', err.message);
          return res.status(500).json({ error: 'Failed to delete patient' });
        }

        res.status(200).json({ message: 'Visit terminated and patient moved to visitetermines' });
      });
    });
  });
});

// Handle POST request to cancel a visit
app.post('/api/cancel-visit', authenticateToken, (req, res) => {
  const { id } = req.body;
  const selectPatient = "SELECT * FROM patients WHERE id = ?";
  const insertCanceled = "INSERT INTO visiteannule (id, numero, nom, prenom, type) VALUES (?, ?, ?, ?, ?)";
  const deletePatient = "DELETE FROM patients WHERE id = ?";

  db.get(selectPatient, [id], (err, patient) => {
    if (err) {
      console.error('Failed to retrieve patient:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve patient' });
    }
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const { numero, nom, prenom, type } = patient;
    db.run(insertCanceled, [id, numero, nom, prenom, type], (err) => {
      if (err) {
        console.error('Failed to insert into visiteannule:', err.message);
        return res.status(500).json({ error: 'Failed to insert into visiteannule' });
      }

      db.run(deletePatient, [id], (err) => {
        if (err) {
          console.error('Failed to delete patient:', err.message);
          return res.status(500).json({ error: 'Failed to delete patient' });
        }

        res.status(200).json({ message: 'Visit canceled and patient moved to visiteannule' });
      });
    });
  });
});

// Handle GET requests to retrieve all terminated visits
app.get('/api/visitestermines', authenticateToken, (req, res) => {
  db.all("SELECT * FROM visitetermines", (err, rows) => {
    if (err) {
      console.error('Failed to retrieve terminated visits:', err.message);
      res.status(500).json({ error: 'Failed to retrieve terminated visits' });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Handle GET requests to retrieve all canceled visits
app.get('/api/visitesannules', authenticateToken, (req, res) => {
  db.all("SELECT * FROM visiteannule", (err, rows) => {
    if (err) {
      console.error('Failed to retrieve canceled visits:', err.message);
      res.status(500).json({ error: 'Failed to retrieve canceled visits' });
    } else {
      res.status(200).json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  fetchAndLogPatients();
});
