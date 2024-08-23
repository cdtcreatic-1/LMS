'use strict';

module.exports = (sequelize, DataTypes) => {
    const CurrentWindow = sequelize.define('CurrentWindow', {

        id_current_window: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true
        },
        id_user: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            references: {
                model: 'users_table',
                key: 'id_user'
            }
        },
        current_window_id: {
            type: DataTypes.SMALLINT,
            defaultValue: 0
        },
        current_farm_number_lot: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'current_window_table',
        timestamps: false,
    });

    CurrentWindow.associate = function (db) {
        CurrentWindow.belongsTo(db.User, { foreignKey: 'id_user' });
    };

    return CurrentWindow;
};