'use strict';


module.exports = (sequelize, DataTypes) => {
    const FarmPhotos = sequelize.define('FarmPhotos', {
        id_farm: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'farms_table',
                key: 'id_farm',
            },
        },
        farm_photo_1: {
            type: DataTypes.STRING(250),
            allowNull: true,
            unique: true,
        },

        farm_photo_2: {
            type: DataTypes.STRING(250),
            allowNull: true,
            unique: true,
        },

        farm_photo_3: {
            type: DataTypes.STRING(250),
            allowNull: true,
            unique: true,
        },

    }, {
        tableName: 'farm_photos',
        timestamps: false,
    });

    FarmPhotos.associate = function (db) {
        FarmPhotos.belongsTo(
            db.Farms, { foreignKey: 'id_farm' }
        );
    }

    return FarmPhotos;
};