const express = require('express');
const router = express.Router();

const propertyRoutes = require('./property.routes');

router.use('/properties', propertyRoutes);

module.exports = router;
