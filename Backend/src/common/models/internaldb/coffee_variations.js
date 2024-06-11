'use strict';

module.exports = (sequelize, DataTypes) => {
    const CoffeeVariations = sequelize.define('CoffeeVariations', {
        id_variety: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        variety_name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
        },
    }, {
        tableName: 'coffee_variations_table',
        timestamps: false,
    });

    return CoffeeVariations;
}