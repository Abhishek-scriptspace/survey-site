const mysql = require('mysql2/promise');
// require('dotenv').config(); // Removed dotenv requirement

const pool = mysql.createPool({
  host: 'localhost', 
  user: 'root',     
  password: '', 
  database: 'ngo_website', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool; 