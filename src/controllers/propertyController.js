const { Property } = require('../models');
const { Op } = require('sequelize');

exports.getAllProperties = async (req, res, next) => {
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
    next(error);
  }
};

exports.getPropertyAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id);

    if (!property) {
      const error = new Error('Property not found');
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      id: property.id,
      available_from: property.available_from,
      available_to: property.available_to
    });
  } catch (error) {
    next(error);
  }
};
