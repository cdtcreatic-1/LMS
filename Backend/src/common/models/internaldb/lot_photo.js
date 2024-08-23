'use strict';

module.exports = (sequelize, DataTypes) => {
  const LotPhoto = sequelize.define('LotPhoto', {
    id_lot_photo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_lot: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'lot_table',
        key: 'id_lot',
      },
    },
    lot_photo: {
      type: DataTypes.STRING(250),
      allowNull: true,
    }
  }, {
    tableName: 'lot_photo',
    timestamps: false,
  });

  LotPhoto.associate = function (db) {
    db.LotPhoto.belongsTo(db.Lots, {
      foreignKey: 'id_lot' });
  };   

  return LotPhoto;
};
