const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

router.post('/', propertyController.createProperty);
router.get('/', propertyController.getAllProperties);
router.get('/:id/availability', propertyController.getPropertyAvailability);

module.exports = router;
