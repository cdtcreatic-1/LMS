'use strict';

module.exports = (sequelize, DataTypes) => {
    const ShippingOptions = sequelize.define('ShippingOptions', {
        id_shipping_option: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        shipping_option_name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        },
        shipping_option_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'shipping_options_table'
    });

    return ShippingOptions;

};
