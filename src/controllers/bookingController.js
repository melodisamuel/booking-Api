const { Booking, Property } = require('../../models');
const { Op } = require('sequelize');

// Helper function: Check for overlapping bookings
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

// POST /bookings - Create booking
exports.createBooking = async (req, res) => {
  try {
    const { property_id, user_name, start_date, end_date } = req.body;

    // Basic validation
    if (!property_id || !user_name || !start_date || !end_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({ message: 'start_date must be before end_date' });
    }

    // Check property existence & availability
    const property = await Property.findByPk(property_id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (
      new Date(start_date) < new Date(property.available_from) ||
      new Date(end_date) > new Date(property.available_to)
    ) {
      return res.status(400).json({ message: 'Dates outside property availability range' });
    }

    // Check overlapping bookings
    const overlap = await isOverlapping(property_id, start_date, end_date);
    if (overlap) {
      return res.status(400).json({ message: 'Booking dates overlap with existing booking' });
    }

    // Create booking
    const booking = await Booking.create({
      property_id,
      user_name,
      start_date,
      end_date,
      created_at: new Date()
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /bookings/:id - Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.destroy();
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// BONUS: PUT /bookings/:id - Update booking
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date } = req.body;

    if (!start_date || !end_date) {
      return res.status(400).json({ message: 'start_date and end_date are required' });
    }

    if (new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({ message: 'start_date must be before end_date' });
    }

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const property = await Property.findByPk(booking.property_id);
    if (
      new Date(start_date) < new Date(property.available_from) ||
      new Date(end_date) > new Date(property.available_to)
    ) {
      return res.status(400).json({ message: 'Dates outside property availability range' });
    }

    // Check overlaps excluding current booking
    const overlap = await isOverlapping(booking.property_id, start_date, end_date, id);
    if (overlap) {
      return res.status(400).json({ message: 'Booking dates overlap with existing booking' });
    }

    booking.start_date = start_date;
    booking.end_date = end_date;
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
