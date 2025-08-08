const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // or wherever your sequelize instance is

const Booking = sequelize.define('Booking', {
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'bookings',
  timestamps: false,
});

Booking.associate = function(models) {
  Booking.belongsTo(models.Property, { foreignKey: 'property_id' });
};

module.exports = Booking;
