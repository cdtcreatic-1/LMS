'use strict';

module.exports = (sequelize, DataTypes) => {
  const LotQuantity = sequelize.define('LotQuantity', {
    id_lot_quantity: {
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
    total_quantity: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    samples_quantity: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    id_association: {
      type: DataTypes.SMALLINT,
      references: {
          model: 'associations_table',
          key: 'id_association',
      },
      allowNull: true
    },
    price_per_kilo: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    lot_quantity_created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('NOW()')
    },
    lot_quantity_updated_at: {
        type: DataTypes.DATE
    },
    lot_quantity_deleted_at: {
        type: DataTypes.DATE
    }
  }, {
    tableName: 'lot_quantity',
    timestamps: false,
  });

  LotQuantity.associate = function (db) {
    db.LotQuantity.belongsTo(db.Lots, {
      foreignKey: 'id_lot' });
    db.LotQuantity.belongsTo(db.Associations, {
      foreignKey: 'id_association' });
  };   

  return LotQuantity;
}
