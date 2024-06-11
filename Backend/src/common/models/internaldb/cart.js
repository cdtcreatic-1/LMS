'use strict';

module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
        id_cart: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        id_seller: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users_table',
                key: 'id_user',
            },
        },

        id_buyer: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users_table',
                key: 'id_user',
            },
        },

        id_lot: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'lot_table',
                key: 'id_lot',
            },
        },

        is_in_purchase: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        cart_created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('NOW()')
        },

        cart_updated_at: {
            type: DataTypes.DATE
        },

        cart_deleted_at: {
            type: DataTypes.DATE
        },

    }, {
        tableName: 'cart_table',
        timestamps: false,
    });

    Cart.associate = function (db) {
        Cart.belongsTo(db.User, { as: 'Seller', foreignKey: 'id_seller' });
        Cart.belongsTo(db.User, { as: 'Buyer', foreignKey: 'id_buyer' });
        Cart.belongsTo(db.Lots, { foreignKey: 'id_lot' });
    }

    return Cart;
}
