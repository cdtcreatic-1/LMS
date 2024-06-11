// CREATE TABLE user_gender(
//     id_user_gender SERIAL PRIMARY KEY,
//     user_gender_name VARCHAR(45) NOT NULL
// );
'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserGender = sequelize.define('UserGender', {
        id_user_gender: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        user_gender_name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
    }, {
        tableName: 'user_gender',
        timestamps: false,
    });

    return UserGender;
}


