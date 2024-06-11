'use strict';
module.exports = (sequelize, DataTypes) => {
    const OfferStatus = sequelize.define('OfferStatus', {
        id_offer_status: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        offer_status_name: {
            type: DataTypes.STRING(250),
            allowNull: false
        }
    }, {
        tableName: 'offer_status_table',
        timestamps: false,
    });

    return OfferStatus
};
