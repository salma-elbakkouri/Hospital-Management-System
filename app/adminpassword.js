const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

// const dbPath = 'C:\\Users\\salma\\OneDrive\\Bureau\\hospitalDB\\db.db';
const path = require('path');
const dbPath = path.join(__dirname, '..', 'hospitalDB.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);

const username = 'admin'; // Replace with your desired admin username
const plainTextPassword = 'e3ZX-@è-864AB'; // Replace with your desired admin password
const saltRounds = 10;

bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }

  const query = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
  const params = [username, hash, 'admin'];

  db.run(query, params, function(err) {
    if (err) {
      console.error('Error inserting user:', err.message);
    } else {
      console.log('Admin user created with ID:', this.lastID);
    }
    db.close();
  });
});
