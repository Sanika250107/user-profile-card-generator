
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Create the database folder if it doesn't exist
const databaseFolder = __dirname;
fs.mkdirSync(databaseFolder, { recursive: true });

// Open or create the SQLite database
const db = new Database(
  path.join(databaseFolder, "profiles.db")
);

// Create the profiles table
db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    bio TEXT,
    skills TEXT,
    github TEXT,
    linkedin TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
