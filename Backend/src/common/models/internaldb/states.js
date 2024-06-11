'use strict';

module.exports = (sequelize, DataTypes) => {
    const States = sequelize.define('States', {
        id_state: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_country: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: sequelize.models.Countries,
                key: 'id_country',
            },
        },
        state_name: {
            type: DataTypes.STRING(90),
            allowNull: false,
        },
    }, {
        tableName: 'states_table',
        timestamps: false,
    });

    States.associate = function(db) {
        States.belongsTo(db.Countries, { foreignKey: 'id_country' });
    };
    
    return States;
}
