'use strict';

module.exports = (sequelize, DataTypes) => {
    const CartCourse = sequelize.define('CartCourse', {
        id_cart_course: {
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
        id_course: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'course_table',
                key: 'id_course',
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
        tableName: 'cart_course_table',
        timestamps: false,
    });

    CartCourse.associate = function(models) {
        CartCourse.belongsTo(models.User, { as: 'Seller', foreignKey: 'id_seller' });
        CartCourse.belongsTo(models.User, { as: 'Buyer', foreignKey: 'id_buyer' });
        CartCourse.belongsTo(models.Course, { foreignKey: 'id_course' });
    };

    return CartCourse;
};
