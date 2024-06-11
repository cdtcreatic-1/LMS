'use strict';

module.exports = (sequelize, DataTypes) => {
    const Purchase = sequelize.define('Purchase', {
        id_purchase: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
            type: DataTypes.SMALLINT,
            allowNull: false,
            references: {
                model: 'lot_table',
                key: 'id_lot',
            },
        },
        purchase_quantity: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        id_purchase_status: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            references: {
                model: 'purchase_status_options_table',
                key: 'id_purchase_status',
            },
        },
        id_shipping_option: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            references: {
                model: 'shipping_options_table',
                key: 'id_shipping_option',
            },
        },
        shipping_address: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        additional_notes: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        is_sample: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        purchase_created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('NOW()')
        },
        purchase_updated_at: {
            type: DataTypes.DATE
        },
        purchase_deleted_at: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'purchase_table',
        timestamps: false,
        
    });

    Purchase.associate = function(db) {
        Purchase.belongsTo(db.User, { as: 'Seller', foreignKey: 'id_seller'});
        Purchase.belongsTo(db.User, { as: 'Buyer', foreignKey: 'id_buyer'});
        Purchase.belongsTo(db.Lots, { foreignKey: 'id_lot'});
        Purchase.belongsTo(db.PurchaseOptions, { foreignKey: 'id_purchase_status'});
        Purchase.belongsTo(db.ShippingOptions, { foreignKey: 'id_shipping_option'});
    }

    return Purchase;
}
