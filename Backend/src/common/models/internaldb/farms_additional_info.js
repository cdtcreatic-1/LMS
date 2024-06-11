'use strict';

module.exports = (sequelize, DataTypes) => {
  const FarmAdditionalInfo = sequelize.define('FarmAdditionalInfo', {
    id_farm_additional_info: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: true,
    },
    id_farm: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'farms_table',
        key: 'id_farm'
      }
    },
    altitude: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    climate: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    temperature: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  }, {
    tableName: 'farms_additional_info',
    timestamps: false
  });

  FarmAdditionalInfo.associate = function (db) {
    db.FarmAdditionalInfo.belongsTo(db.Farms, { 
      foreignKey: 'id_farm' });
  };

  return FarmAdditionalInfo;
}
