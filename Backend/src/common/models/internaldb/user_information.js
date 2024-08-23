'use strict';

module.exports = (sequelize, DataTypes) => {
    const user_information = sequelize.define('user_information', {

        id_user_information: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        id_user: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'users_table',
                key: 'id_user',
            },
        },

        id_type_of_information: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'type_of_information_table',
                key: 'id_type_of_information'
            }
        },

        user_personal_description_text: {
            type: DataTypes.TEXT,
        },
        

    }, {
        tableName: 'user_information_table',
        timestamps: false,
    });

    user_information.associate = (db) => {
        user_information.belongsTo(db.User, { foreignKey: 'id_user' });
        user_information.belongsTo(db.TypeInformation, {foreignKey: 'id_type_of_information'});
    };

    return user_information;
};
