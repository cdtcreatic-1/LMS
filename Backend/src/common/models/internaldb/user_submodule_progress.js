'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserSubmoduleProgress = sequelize.define('UserSubmoduleProgress', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users_table',
        key: 'id_user',
      }
    },
    id_submodule: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'submodule_table',
        key: 'id_submodule',
      }
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }, success_rate: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: true,
    }
  }, {
    tableName: 'user_submodule_progress',
    timestamps: false,
  });

  UserSubmoduleProgress.associate = function (db) {

  };

  return UserSubmoduleProgress;
};
