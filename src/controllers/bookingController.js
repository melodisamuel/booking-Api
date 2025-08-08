const { Booking, Property } = require('../models');
const { isBookingOverlapping, isStartBeforeEnd, areDatesWithinAvailability } = require('../utils/dateUtils');

exports.createBooking = async (req, res, next) => {
  try {
    const { property_id, user_name, start_date, end_date } = req.body;

    if (!property_id || !user_name || !start_date || !end_date) {
      const error = new Error('Missing required fields');
      error.statusCode = 400;
      return next(error);
    }

    //  helper function
    if (!isStartBeforeEnd(start_date, end_date)) {
      const error = new Error('start_date must be before end_date');
      error.statusCode = 400;
      return next(error);
    }

    const property = await Property.findByPk(property_id);
    if (!property) {
      const error = new Error('Property not found');
      error.statusCode = 404;
      return next(error);
    }

    //  inline availability check with helper
    if (!areDatesWithinAvailability(start_date, end_date, property.available_from, property.available_to)) {
      const error = new Error('Dates outside property availability range');
      error.statusCode = 400;
      return next(error);
    }

    //  inline overlap logic with helper
    const overlap = await isBookingOverlapping(property_id, start_date, end_date);
    if (overlap) {
      const error = new Error('Booking dates overlap with existing booking');
      error.statusCode = 400;
      return next(error);
    }

    const booking = await Booking.create({
      property_id,
      user_name,
      start_date,
      end_date,
      created_at: new Date()
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      return next(error);
    }

    await booking.destroy();
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start_date, end_date } = req.body;

    if (!start_date || !end_date) {
      const error = new Error('start_date and end_date are required');
      error.statusCode = 400;
      return next(error);
    }

    //  helper for start < end check
    if (!isStartBeforeEnd(start_date, end_date)) {
      const error = new Error('start_date must be before end_date');
      error.statusCode = 400;
      return next(error);
    }

    const booking = await Booking.findByPk(id);
    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      return next(error);
    }

    const property = await Property.findByPk(booking.property_id);
    
    //  helper for availability check
    if (!areDatesWithinAvailability(start_date, end_date, property.available_from, property.available_to)) {
      const error = new Error('Dates outside property availability range');
      error.statusCode = 400;
      return next(error);
    }

    //  helper for overlap check, excluding current booking ID
    const overlap = await isBookingOverlapping(booking.property_id, start_date, end_date, id);
    if (overlap) {
      const error = new Error('Booking dates overlap with existing booking');
      error.statusCode = 400;
      return next(error);
    }

    booking.start_date = start_date;
    booking.end_date = end_date;
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};
