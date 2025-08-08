const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.delete('/:id', bookingController.cancelBooking);
router.put('/:id', bookingController.updateBooking); // Bonus

module.exports = router;
