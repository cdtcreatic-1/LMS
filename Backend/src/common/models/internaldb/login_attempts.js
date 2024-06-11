'use strict';

module.exports = (sequelize, DataTypes) => {
    const LoginAttempts = sequelize.define('LoginAttempts', {
        id_user_login: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users_table',
                key: 'id_user',
            },
        },
        failed_attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        last_failed_attempt: {
            type: DataTypes.DATE,
            defaultValue: null
        }
    }, {
        tableName: 'user_login_attempts',
        timestamps: false,
    });

    LoginAttempts.associate = function(db) {
        LoginAttempts.belongsTo(db.User, { foreignKey: 'id_user' });
    };

    return LoginAttempts;
};
