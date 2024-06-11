'use strict';

module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define('Roles', {
        id_role: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        role_name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
        },
    }, {
        tableName: 'roles_table',
        timestamps: false,
    });

    return Roles;
};
