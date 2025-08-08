const { Booking, Property } = require('../../models');
const { Op } = require('sequelize');

const isOverlapping = async (property_id, start_date, end_date, excludeBookingId = null) => {
  const whereClause = {
    property_id,
    [Op.or]: [
      { start_date: { [Op.between]: [start_date, end_date] } },
      { end_date: { [Op.between]: [start_date, end_date] } },
      {
        [Op.and]: [
          { start_date: { [Op.lte]: start_date } },
          { end_date: { [Op.gte]: end_date } }
        ]
      }
    ]
  };

  if (excludeBookingId) {
    whereClause.id = { [Op.ne]: excludeBookingId };
  }

  const overlappingBooking = await Booking.findOne({ where: whereClause });
  return !!overlappingBooking;
};

exports.createBooking = async (req, res, next) => {
  try {
    const { property_id, user_name, start_date, end_date } = req.body;

    if (!property_id || !user_name || !start_date || !end_date) {
      const error = new Error('Missing required fields');
      error.statusCode = 400;
      return next(error);
    }

    if (new Date(start_date) >= new Date(end_date)) {
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

    if (
      new Date(start_date) < new Date(property.available_from) ||
      new Date(end_date) > new Date(property.available_to)
    ) {
      const error = new Error('Dates outside property availability range');
      error.statusCode = 400;
      return next(error);
    }

    const overlap = await isOverlapping(property_id, start_date, end_date);
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

    if (new Date(start_date) >= new Date(end_date)) {
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
    if (
      new Date(start_date) < new Date(property.available_from) ||
      new Date(end_date) > new Date(property.available_to)
    ) {
      const error = new Error('Dates outside property availability range');
      error.statusCode = 400;
      return next(error);
    }

    const overlap = await isOverlapping(booking.property_id, start_date, end_date, id);
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
