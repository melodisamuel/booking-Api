const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const bookingRoutes = require('./routes/bookingRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);
app.use('/bookings', bookingRoutes);
app.use('/properties', propertyRoutes);

// Basic health check
app.get('/', (req, res) => {
  res.json({ message: 'Booking API is running 🚀' });
});

// error handling middleware 
app.use(errorHandler);

module.exports = app;
