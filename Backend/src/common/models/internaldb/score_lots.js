'use strict'

module.exports = (sequelize, DataTypes) => {
    const ScoreLots = sequelize.define('ScoreLots', {
        id_score_lots: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_lot: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'lots',
                key: 'id_lot',
            },
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users_table',
                key: 'id_user',
            },
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'score_lots',
        timestamps: false,
    });
    ScoreLots.associate = function(db) {
        ScoreLots.belongsTo(db.Lots, {
            foreignKey: 'id_lot'
        });
        ScoreLots.belongsTo(db.User, {
            foreignKey: 'id_user'
        });
    };
    return ScoreLots;
}