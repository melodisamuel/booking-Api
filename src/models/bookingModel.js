Booking.associate = function(models) {
    Booking.belongsTo(models.Property, { foreignKey: 'property_id' });
  };
  