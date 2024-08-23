'use strict';

module.exports = (sequelize, DataTypes) => {
    const MakeOffer = sequelize.define('MakeOffer', {
        id_make_offer: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_offer_status: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            references: {
                model: 'offer_status_table',
                key: 'id_offer_status',
            },
        },
        id_seller: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            references: {
                model: 'users_table',
                key: 'id_user',
            },
        },
        id_buyer: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            references: {
                model: 'users_table',
                key: 'id_user',
            },
        },
        id_lot: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            references:{
                model: 'lot_table',
                key: 'id_lot',
            },
        },
        offer_created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('NOW()')
        },
        offer_updated_at: {
            type: DataTypes.DATE
        },
        offer_deleted_at: {
            type: DataTypes.DATE
        }

    }, {
        tableName: 'make_offer_table',
        timestamps: false,
    });

    MakeOffer.associate = function (db) {
        MakeOffer.belongsTo(db.User, {as: 'Seller', foreignKey: 'id_seller'});
        MakeOffer.belongsTo(db.User, {as: 'Buyer', foreignKey: 'id_buyer'});
        MakeOffer.belongsTo(db.Lots, {foreignKey: 'id_lot'});
        MakeOffer.belongsTo(db.OfferStatus, {foreignKey: 'id_offer_status'});
    }
    return MakeOffer;
};
