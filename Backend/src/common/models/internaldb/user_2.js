'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User_2', {
    id_user: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      references: {
        model: 'users_table',
        key: 'id_user',
      },
    },
    user_identification_number: {
      type: DataTypes.STRING(45),
      allowNull: true,
      unique: true,
    },
    user_situation: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  }, {
    tableName: 'users_table_2',
    timestamps: false,
  });

  return User;
};
