// const { DataTypes } = require('sequelize');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Property = sequelize.define('Property', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price_per_night: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  available_from: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  available_to: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  tableName: 'properties',
  timestamps: false,
});

//  Associations 
Property.associate = function(models) {
  Property.hasMany(models.Booking, { foreignKey: 'property_id' });
};

module.exports = Property;
