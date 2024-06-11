'use strict';

module.exports = (sequelize, DataTypes) => {
    const Cities = sequelize.define('Cities', {
        id_city: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_state: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: sequelize.models.States,
                key: 'id_state',
            },
        },
        city_name: {
            type: DataTypes.STRING(90),
            allowNull: false,
        },
    }, {
        tableName: 'cities_table',
        timestamps: false,
    });

    Cities.associate = function (db) {
        Cities.belongsTo(db.States, { foreignKey: 'id_state' });
    };

    return Cities;
}
