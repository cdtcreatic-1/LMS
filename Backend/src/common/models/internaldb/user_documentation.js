'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserDocumentation = sequelize.define('UserDocumentation', {
    id_user: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      references: {
        model: 'users_table',
        key: 'id_user',
      },
    },

    user_identification_document: {
      type: DataTypes.STRING(250),
    },

    user_rut_identification: {
      type: DataTypes.STRING(250),
      allowNull: true,
      unique: true,
    },

    user_tax_identification: {
      type: DataTypes.STRING(250),
      allowNull: true,
      unique: true,
    },
  }, {
    tableName: 'users_documentation',
    timestamps: false,
  });

  UserDocumentation.associate = function(db) {
    UserDocumentation.belongsTo(db.User, { foreignKey: 'id_user' });
  };

  return UserDocumentation;
};
