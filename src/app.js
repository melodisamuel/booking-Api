const express = require('express');
const bodyParser = require('body-parser');
// const routes = require('./routes'); // we'll create this later

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

module.exports = app;
