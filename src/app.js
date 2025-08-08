const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorHandler');
// const routes = require('./routes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// app.use('/api', routes);

// Basic health check
app.get('/', (req, res) => {
  res.json({ message: 'Booking API is running 🚀' });
});

// error handling middleware 
app.use(errorHandler);

module.exports = app;
