const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask, validateTask } = require('../controllers/taskController');

router.post('/', validateTask, createTask);
router.get('/', getTasks);
router.put('/:id', validateTask, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;