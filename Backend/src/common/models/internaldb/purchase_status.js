'use strict'

module.exports = (sequelize, DataTypes) => {
    const PurchaseOptions = sequelize.define('PurchaseOptions', {
        id_purchase_status: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        status_name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
        },
    }, {
        timestamps: false,
        tableName: 'purchase_status_options_table',
    });

    return PurchaseOptions;
}

