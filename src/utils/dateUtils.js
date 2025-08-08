// src/validations/dateValidation.js
const { Booking } = require('../models');
const { Op } = require('sequelize');

function isStartBeforeEnd(start_date, end_date) {
  return new Date(start_date) < new Date(end_date);
}

function areDatesWithinAvailability(start_date, end_date, available_from, available_to) {
  const start = new Date(start_date);
  const end = new Date(end_date);
  const availableFrom = new Date(available_from);
  const availableTo = new Date(available_to);

  return start >= availableFrom && end <= availableTo;
}

async function isBookingOverlapping(property_id, start_date, end_date, excludeBookingId = null) {
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
}

module.exports = {
  isStartBeforeEnd,
  areDatesWithinAvailability,
  isBookingOverlapping,
};
