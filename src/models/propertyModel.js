Property.associate = function(models) {
    Property.hasMany(models.Booking, { foreignKey: 'property_id' });
  };
  