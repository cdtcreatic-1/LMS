'use strict';

module.exports = (sequelize, DataTypes) => {
    const Countries = sequelize.define('Countries', {
        id_country: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        country_name_en: {
            type: DataTypes.STRING(90),
            allowNull: false,
        },
        country_name_es: {
            type: DataTypes.STRING(90),
            allowNull: false,
        },
        country_iso2: {
            type: DataTypes.STRING(45),
            unique: true,
            allowNull: false,
        },
        country_iso3: {
            type: DataTypes.STRING(45),
            unique: true,
            allowNull: false,
        },
        country_numericcode: {
            type: DataTypes.STRING(45),
            unique: true,
            allowNull: false,
        },
        country_phonecode: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
    }, {
        tableName: 'countries_table',
        timestamps: false,
    });

    return Countries;
}
