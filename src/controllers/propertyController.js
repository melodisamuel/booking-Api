const { Property } = require('../models');
const { Op } = require('sequelize');

exports.createProperty = async (req, res, next) => {
  try {
    const { title, description, price_per_night, available_from, available_to } = req.body;

    if (!title || !price_per_night || !available_from || !available_to) {
      const error = new Error('Missing required fields');
      error.statusCode = 400;
      return next(error);
    }

    if (new Date(available_from) > new Date(available_to)) {
      const error = new Error('available_from must be before available_to');
      error.statusCode = 400;
      return next(error);
    }

    const property = await Property.create({
      title,
      description,
      price_per_night,
      available_from,
      available_to,
    });

    res.status(201).json(property);
  } catch (error) {
    next(error);
  }
};

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
