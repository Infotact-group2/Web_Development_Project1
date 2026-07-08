const express = require('express');
const cors = require('cors');

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check / Root Route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend server is running successfully!'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
