'use strict';
module.exports = (sequelize, DataTypes) => {
    const Villages = sequelize.define('Villages', {
        id_village: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_city: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Cities',
                key: 'id_city',
            },
        },
        village_name: {
            type: DataTypes.STRING(90),
            allowNull: false,
        },
    }, {
        tableName: 'villages_table',
        timestamps: false,
    });

    Villages.associate = function (db) {
        Villages.belongsTo(db.Cities, { foreignKey: 'id_city' });
    };

    return Villages;
}
