'use strict';

module.exports = (sequelize, DataTypes) => {
  const LotSummary = sequelize.define('LotSummary', {
    id_lot_summary: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_lot: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lot_table',
        key: 'id_lot',
      },
    },
    germination_summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sown_summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    harvest_summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    drying_summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    roasting_summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    packaging_summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'lot_summary',
    timestamps: false,
  });

  LotSummary.associate = function (db) {
    db.LotSummary.belongsTo(db.Lots, {
      foreignKey: 'id_lot' });
  };   

  return LotSummary;
};
