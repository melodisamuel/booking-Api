const { Property } = require('../models');
const { Op } = require('sequelize');

// GET /properties (with optional pagination and date filter)
exports.getAllProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10, start_date, end_date } = req.query;
    const offset = (page - 1) * limit;

    let where = {};
    if (start_date && end_date) {
      where = {
        available_from: { [Op.lte]: start_date },
        available_to: { [Op.gte]: end_date }
      };
    }

    const properties = await Property.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      total: properties.count,
      page: parseInt(page),
      totalPages: Math.ceil(properties.count / limit),
      data: properties.rows
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /properties/:id/availability
exports.getPropertyAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({
      id: property.id,
      available_from: property.available_from,
      available_to: property.available_to
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
