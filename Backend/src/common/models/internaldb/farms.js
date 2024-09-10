/*"use strict";

module.exports = (sequelize, DataTypes) => {
  const Farms = sequelize.define(
    "Farms",
    {
      id_farm: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      farm_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      farm_number_lots: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      farm_longitude: {
        type: DataTypes.REAL,
        allowNull: true,
      },
      farm_latitude: {
        type: DataTypes.REAL,
        allowNull: true,
      },
      id_user: {
        type: DataTypes.INTEGER,
        references: {
          model: "users_table",
          key: "id_user",
        },
      },
      id_village: {
        type: DataTypes.INTEGER,
        references: {
          model: "villages_table",
          key: "id_village",
        },
        allowNull: true,
      },
      farm_created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("NOW()"),
      },
      farm_updated_at: {
        type: DataTypes.DATE,
      },
      farm_deleted_at: {
        type: DataTypes.DATE,
      },
      farm_status: {
        type: Boolean,
        required: false,
        default: true,
      },
      name_provided_by_user: {
        type: String
      }
    },
    {
      tableName: "farms_table",
      timestamps: false,
    }
  );

  Farms.associate = function (db) {
    Farms.belongsTo(db.Villages, { foreignKey: "id_village" });
    Farms.belongsTo(db.User, { foreignKey: "id_user" });
    Farms.hasOne(db.FarmPhotos, { foreignKey: "id_farm" });
  };

  return Farms;
};*/
