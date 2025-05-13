const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tasks.db');

const createTaskTable = () => {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      )`,
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

module.exports = {
  createTaskTable,
  db,
};
