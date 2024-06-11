'use strict';

module.exports = (sequelize, DataTypes) => {
  const BusinesmanCoffeeInterested = sequelize.define('BusinesmanCoffeeInterested', {
    id_user: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      references: {
        model: 'users_table',
        key: 'id_user',
      },
    },
    id_profile: {
      type: DataTypes.SMALLINT,
      references: {
        model: 'coffee_profile_table',
        key: 'id_profile',
      },
    },
    id_roast: {
      type: DataTypes.SMALLINT,
      references: {
        model: 'roasting_type_table',
        key: 'id_roast',
      },
    },
    id_city: {
      type: DataTypes.SMALLINT,
      references: {
        model: 'cities_table',
        key: 'id_city',
      },
    },
  }, {
    tableName: 'businesman_coffee_interested',
    timestamps: false,
  });

  return BusinesmanCoffeeInterested;
};
