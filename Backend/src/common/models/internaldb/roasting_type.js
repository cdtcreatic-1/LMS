'use strict';

module.exports = (sequelize, DataTypes) => {
    const RoastingType = sequelize.define('RoastingType', {
        id_roast: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        roasting_name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
        },
    }, {
        tableName: 'roasting_type_table',
        timestamps: false,
    });

    return RoastingType;
}