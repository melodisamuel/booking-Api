const express = require('express');
const router = express.Router();

const propertyRoutes = require('./property.routes');
const bookingRoutes = require('./booking.routes');

router.use('/properties', propertyRoutes);
router.use('/bookings', bookingRoutes);

module.exports = router;
