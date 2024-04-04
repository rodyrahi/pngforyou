const Database = require('better-sqlite3');

// open database
const imagesdb = new Database("../database/pngforyou/images.db");

// create images table
imagesdb.exec(`CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  name TEXT,
  alt TEXT,
  path TEXT,
  category TEXT,
  style TEXT,
  tags TEXT,
  views INTEGER,
  likes INTEGER,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);



imagesdb.exec(`CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);


console.log("Images table created.");


console.log('Connected to the database');

module.exports = {imagesdb};
