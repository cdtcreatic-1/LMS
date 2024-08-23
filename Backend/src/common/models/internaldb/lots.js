"use strict";

module.exports = (sequelize, DataTypes) => {
  const Lots = sequelize.define(
    "Lots",
    {
      id_lot: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lot_number: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      id_farm: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        references: {
          model: "farms_table",
          key: "id_farm",
        },
      },
      id_variety: {
        type: DataTypes.SMALLINT,
        references: {
          model: "coffee_variations_table",
          key: "id_variety",
        },
        allowNull: true,
      },
      id_profile: {
        type: DataTypes.SMALLINT,
        references: {
          model: "coffee_profile_table",
          key: "id_profile",
        },
        allowNull: true,
      },
      id_roast: {
        type: DataTypes.SMALLINT,
        references: {
          model: "roasting_type_table",
          key: "id_roast",
        },
        allowNull: true,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
      },
      lot_created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("NOW()"),
      },
      lot_updated_at: {
        type: DataTypes.DATE,
      },
      lot_deleted_at: {
        type: DataTypes.DATE,
      },
      lot_status: {
        type: Boolean,
        default: true,
        required: false,
      },
      lot_coding: {
        type: String
      }
    },
    {
      tableName: "lot_table",
      timestamps: false,
    }
  );

  Lots.associate = function (db) {
    db.Lots.belongsTo(db.CoffeeVariations, {
      foreignKey: "id_variety",
    });
    db.Lots.belongsTo(db.CoffeeProfile, {
      foreignKey: "id_profile",
    });
    db.Lots.belongsTo(db.RoastingType, {
      foreignKey: "id_roast",
    });
    db.Lots.hasOne(db.LotQuantity, {
      foreignKey: "id_lot",
    });
    db.Lots.hasOne(db.LotSummary, {
      foreignKey: "id_lot",
    });
    db.Lots.hasOne(db.LotCertifications, {
      foreignKey: "id_lot",
    });
    db.Lots.hasOne(db.LotPhoto, {
      foreignKey: "id_lot",
    });
    db.Lots.hasOne(db.ScoreLots, {
      foreignKey: "id_lot",
    });
    db.Lots.belongsTo(db.Farms, {
      foreignKey: "id_farm",
    });
  };

  return Lots;
};
