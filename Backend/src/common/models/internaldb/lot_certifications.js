'use strict';

module.exports = (sequelize, DataTypes) => {
  const LotCertifications = sequelize.define('LotCertifications', {
    id_lot_certifications: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_lot: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'lot_table',
        key: 'id_lot'
      }
    },
    product_sc_certificate: {
      type: DataTypes.STRING(250),
      allowNull: true,
      unique: true
    },
    product_taster_certificate: {
      type: DataTypes.STRING(250),
      allowNull: true,
      unique: true
    },
    contact_qgrader: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'lot_certifications',
    timestamps: false
  });

  LotCertifications.associate = function (db) {
    db.LotCertifications.belongsTo(db.Lots, { 
      foreignKey: 'id_lot' });
  };

  return LotCertifications;
};