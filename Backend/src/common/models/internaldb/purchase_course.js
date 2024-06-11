'use strict';

module.exports = (sequelize, DataTypes) => {
    const PurchaseCourse = sequelize.define('PurchaseCourse', {
        id_purchase_course: {
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
        id_course: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            references: {
                model: 'course_table',
                key: 'id_course',
            },
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
        tableName: 'purchase_course_table',
        timestamps: false,
        
    });

    PurchaseCourse.associate = function(db) {
        PurchaseCourse.belongsTo(db.User, { as: 'Seller', foreignKey: 'id_seller'});
        PurchaseCourse.belongsTo(db.User, { as: 'Buyer', foreignKey: 'id_buyer'});
        PurchaseCourse.belongsTo(db.Course, { foreignKey: 'id_course'});
        PurchaseCourse.belongsTo(db.PurchaseOptions, { foreignKey: 'id_purchase_status'});
        PurchaseCourse.belongsTo(db.ShippingOptions, { foreignKey: 'id_shipping_option'});
    }

    return PurchaseCourse;
}
