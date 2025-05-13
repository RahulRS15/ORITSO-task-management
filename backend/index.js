require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const { createTaskTable } = require('./models/taskModel');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
createTaskTable().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});