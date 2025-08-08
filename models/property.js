'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Property.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price_per_night: DataTypes.FLOAT,
    available_from: DataTypes.DATE,
    available_to: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Property',
  });
  return Property;
};