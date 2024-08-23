'use strict';

module.exports = (sequelize, DataTypes) => {
    const CoffeeProfile = sequelize.define('CoffeeProfile', {
        id_profile: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        profile_name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
        },
    }, {
        tableName: 'coffee_profile_table',
        timestamps: false,
    });

    return CoffeeProfile;
}
