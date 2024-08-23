'use strict'

module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
        id_user_role: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_user: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id_user',
            },
        },
        id_role: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            references: {
                model: 'roles_table',
                key: 'id_role',
            },
        },
    }, {
        timestamps: false,
        tableName: 'user_role',
    });

    UserRole.associate = function (db) {
        UserRole.belongsTo(db.User, {
            foreignKey: 'id_user',
        });

        UserRole.belongsTo(db.Roles, {
            foreignKey: 'id_role'
        });
    }

    return UserRole;
}

