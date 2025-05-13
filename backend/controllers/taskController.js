const { pool } = require('../models/taskModel');
const { body, validationResult } = require('express-validator');

const validateTask = [
  body('title').notEmpty().withMessage('Title is required'),
  body('due_date').optional().isDate().withMessage('Invalid date format'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
];

const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, description, due_date, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks(title, description, due_date, status) VALUES($1, $2, $3, $4) RETURNING *',
      [title, description, due_date, status || 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getTasks = async (req, res) => {
  const { search } = req.query;
  try {
    const query = search
      ? 'SELECT * FROM tasks WHERE title ILIKE $1 OR description ILIKE $1'
      : 'SELECT * FROM tasks';
    const result = await pool.query(query, search ? [`%${search}%`] : []);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  const { title, description, due_date, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET title=$1, description=$2, due_date=$3, status=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5 RETURNING *',
      [title, description, due_date, status, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Task not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask, validateTask };