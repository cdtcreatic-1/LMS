'use strict';

module.exports = (sequelize, DataTypes) => {
    const Associations = sequelize.define('Associations', {
        id_association: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        association_name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
        },
        association_situation: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    }, {
        tableName: 'associations_table',
        timestamps: false,
    });

    return Associations;
}
