'use strict';

module.exports = (sequelize, DataTypes) => {
  const FarmDocumentation = sequelize.define('FarmDocumentation', {
    id_farm_documentation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'users_table',
        key: 'id_user',
      },
      unique: true,
    },
    farm_documentation_id_document: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
    },
    farm_documentation_rut: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
    },
    farm_documentation_chamber_commerce: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
    }
  }, {
    tableName: 'farm_documentation',
    timestamps: false,
  });

  return FarmDocumentation;
};

