const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('booking_api', 'postgres', 'Db_Api', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
